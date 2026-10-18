CREATE TYPE public.app_role AS ENUM ('admin','staff','user');
CREATE TABLE public.user_roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, role public.app_role NOT NULL, UNIQUE(user_id, role));
GRANT SELECT ON public.user_roles TO authenticated; GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.claim_first_admin() RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role='admin') THEN RETURN public.has_role(auth.uid(),'admin'); END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (auth.uid(),'admin'); RETURN true;
END $$;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM public, anon; GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text UNIQUE NOT NULL, name text NOT NULL, category text NOT NULL,
  short text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '', unit text NOT NULL DEFAULT 'per piece',
  variants jsonb NOT NULL DEFAULT '[]', addons jsonb NOT NULL DEFAULT '[]', flavours text[],
  allows_message boolean NOT NULL DEFAULT false, allows_gift_note boolean NOT NULL DEFAULT false,
  min_qty int NOT NULL DEFAULT 1, max_qty int NOT NULL DEFAULT 20, stock int NOT NULL DEFAULT 50, is_active boolean NOT NULL DEFAULT true,
  prep_hours int NOT NULL DEFAULT 24, ingredients text NOT NULL DEFAULT '', allergens text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false, badge text, rating numeric NOT NULL DEFAULT 4.8, reviews int NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '', sort int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.delivery_zones (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, pins text[] NOT NULL DEFAULT '{}', fee int NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true);
CREATE TABLE public.pickup_slots (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), label text NOT NULL, active boolean NOT NULL DEFAULT true, sort int NOT NULL DEFAULT 0);
CREATE TABLE public.store_settings (id int PRIMARY KEY DEFAULT 1 CHECK (id = 1), phone text, whatsapp text, email text, pickup_address text, hours text, service_area text, announcement text,
  min_order int NOT NULL DEFAULT 30000, free_delivery_over int NOT NULL DEFAULT 150000, cod_max_order int NOT NULL DEFAULT 200000, lead_days int NOT NULL DEFAULT 1, booking_window_days int NOT NULL DEFAULT 30, blackout_dates text[] NOT NULL DEFAULT '{}', updated_at timestamptz NOT NULL DEFAULT now());
DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['products','delivery_zones','pickup_slots','store_settings'] LOOP
  EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated; GRANT INSERT, UPDATE, DELETE ON public.%I TO authenticated; GRANT ALL ON public.%I TO service_role; ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t,t,t,t);
  EXECUTE format('CREATE POLICY "admins manage" ON public.%I FOR ALL TO authenticated USING (public.has_role(auth.uid(),''admin'')) WITH CHECK (public.has_role(auth.uid(),''admin''));', t);
END LOOP; END $$;
CREATE POLICY "public reads active products" ON public.products FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "public reads zones" ON public.delivery_zones FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "public reads slots" ON public.pickup_slots FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "public reads settings" ON public.store_settings FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_number text UNIQUE NOT NULL, user_id uuid,
  customer_name text NOT NULL, phone text NOT NULL, email text, fulfilment text NOT NULL CHECK (fulfilment IN ('delivery','pickup')),
  address text, pincode text, scheduled_date date NOT NULL, slot text NOT NULL, notes text,
  payment_method text NOT NULL CHECK (payment_method IN ('online','cod','pickup')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','awaiting_payment','paid','failed','refunded')),
  status text NOT NULL DEFAULT 'placed' CHECK (status IN ('placed','confirmed','baking','ready','out_for_delivery','delivered','completed','cancelled')),
  subtotal int NOT NULL, delivery_fee int NOT NULL DEFAULT 0, total int NOT NULL,
  razorpay_order_id text, razorpay_payment_id text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.order_items (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE, product_id uuid, name text NOT NULL, variant text NOT NULL, options jsonb NOT NULL DEFAULT '{}', unit_price int NOT NULL, qty int NOT NULL, line_total int NOT NULL);
GRANT SELECT, UPDATE ON public.orders TO authenticated; GRANT ALL ON public.orders TO service_role;
GRANT SELECT ON public.order_items TO authenticated; GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY; ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins read items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "admins upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins change product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(),'admin'));

INSERT INTO public.store_settings (id, phone, whatsapp, email, pickup_address, hours, service_area, announcement) VALUES (1,'+91 90000 00000','919000000000','hello@apinchofhome.example','Sample address: 12 Baker''s Lane, Indiranagar, Bengaluru 560038','Tue–Sun, 10:00 am – 8:00 pm','Sample service area: select Bengaluru PIN codes','Freshly baked happiness, made to order ✨');
INSERT INTO public.delivery_zones (name, pins, fee) VALUES ('Zone A (nearby)', ARRAY['560038','560008','560075'], 4900), ('Zone B', ARRAY['560001','560025','560034','560071'], 9900);
INSERT INTO public.pickup_slots (label, sort) VALUES ('10:00–12:00',1),('12:00–14:00',2),('14:00–16:00',3),('16:00–18:00',4),('18:00–20:00',5);

WITH s(slug,name,category,short,price,featured,badge,stock,rating,reviews,sort) AS (VALUES
('classic-fudge-brownie','Classic Fudge Brownie','brownies','Dense, fudgy and deeply chocolatey.',120,true,'Bestseller',50,4.5,18,0),
('triple-chocolate-brownie','Triple Chocolate Brownie','brownies','Dark, milk and white chocolate in every bite.',150,false,NULL,50,4.7,31,1),
('walnut-chocolate-brownie','Walnut Chocolate Brownie','brownies','Toasted walnuts folded into a fudgy base.',160,false,NULL,50,4.9,44,2),
('salted-caramel-brownie','Salted Caramel Brownie','brownies','A ribbon of salted caramel through dark chocolate.',170,true,'New',50,4.6,57,3),
('classic-chocolate-chip-cookie','Classic Chocolate Chip Cookie','cookies','Crisp edges, chewy centre, pools of chocolate.',90,true,'Bestseller',50,4.8,70,4),
('double-chocolate-cookie','Double Chocolate Cookie','cookies','Cocoa dough loaded with dark chocolate chunks.',110,false,NULL,50,4.5,83,5),
('red-velvet-cookie','Red Velvet Cookie','cookies','Soft red velvet with white chocolate chips.',120,false,NULL,50,4.7,96,6),
('sea-salt-chocolate-cookie','Sea Salt Chocolate Cookie','cookies','Brown butter, dark chocolate, flaky sea salt.',120,false,'New',50,4.9,19,7),
('belgian-chocolate-cupcake','Belgian Chocolate Cupcake','cupcakes','Moist chocolate sponge, silky ganache swirl.',140,true,NULL,50,4.6,32,8),
('vanilla-bean-cupcake','Vanilla Bean Cupcake','cupcakes','Light vanilla sponge with buttercream.',120,false,NULL,50,4.8,45,9),
('red-velvet-cupcake','Red Velvet Cupcake','cupcakes','Classic red velvet with cream cheese frosting.',150,false,NULL,50,4.5,58,10),
('salted-caramel-cupcake','Salted Caramel Cupcake','cupcakes','Caramel-filled sponge, salted caramel frosting.',160,false,NULL,50,4.7,71,11),
('chocolate-truffle-cake','Chocolate Truffle Cake','cakes','Layers of chocolate sponge and truffle ganache.',799,true,'Bestseller',50,4.9,84,12),
('classic-vanilla-celebration-cake','Classic Vanilla Celebration Cake','cakes','Vanilla sponge with whipped vanilla cream.',699,false,NULL,50,4.6,97,13),
('red-velvet-cake','Red Velvet Cake','cakes','Velvety layers with cream cheese frosting.',899,false,NULL,50,4.8,20,14),
('chocolate-overload-cake','Chocolate Overload Cake','cakes','Ganache, chocolate shards and a drip finish.',999,false,NULL,50,4.5,33,15),
('fresh-fruit-cake','Fresh Fruit Cake','cakes','Light sponge, fresh cream and seasonal fruit.',899,false,NULL,0,4.7,46,16),
('custom-celebration-cake','Custom Celebration Cake','cakes','Designed with you, for your celebration.',1299,false,NULL,50,4.9,59,17),
('baked-new-york-cheesecake','Baked New York Cheesecake','cheesecakes','Rich, creamy and baked low and slow.',220,false,NULL,50,4.6,72,18),
('blueberry-cheesecake','Blueberry Cheesecake','cheesecakes','Creamy cheesecake with blueberry compote.',240,true,NULL,50,4.8,85,19),
('alphonso-mango-cheesecake','Alphonso Mango Cheesecake','cheesecakes','Silky cheesecake crowned with mango glaze.',260,false,'New',50,4.5,98,20),
('lotus-biscoff-cheesecake','Lotus Biscoff Cheesecake','cheesecakes','Spiced biscuit base, Biscoff swirl and crumbs.',260,false,NULL,50,4.7,21,21),
('tiramisu-dessert-cup','Tiramisu Dessert Cup','dessert-cups','Coffee-soaked layers and mascarpone cream.',220,true,NULL,50,4.9,34,22),
('chocolate-mousse-cup','Chocolate Mousse Cup','dessert-cups','Airy dark chocolate mousse.',180,false,NULL,50,4.6,47,23),
('banoffee-dessert-cup','Banoffee Dessert Cup','dessert-cups','Banana, toffee and whipped cream on a biscuit crumb.',200,false,NULL,50,4.8,60,24),
('strawberry-shortcake-cup','Strawberry Shortcake Cup','dessert-cups','Vanilla sponge, fresh strawberries and cream.',210,false,NULL,50,4.5,73,25),
('brownie-gift-box','Brownie Gift Box','gift-boxes','Six assorted brownies, beautifully boxed.',499,true,NULL,50,4.7,86,26),
('cookie-celebration-box','Cookie Celebration Box','gift-boxes','Eight assorted cookies for sharing.',399,false,NULL,50,4.9,99,27),
('mixed-dessert-box','Mixed Dessert Box','gift-boxes','Brownies, cookies and mini cupcakes together.',699,false,'Bestseller',50,4.6,22,28),
('mini-celebration-dessert-box','Mini Celebration Dessert Box','gift-boxes','A petite assortment for small celebrations.',549,false,NULL,50,4.8,35,29))
INSERT INTO public.products (slug,name,category,short,description,unit,variants,addons,flavours,allows_message,allows_gift_note,max_qty,stock,prep_hours,ingredients,allergens,featured,badge,rating,reviews,image_url,sort)
SELECT slug,name,category,short,
  short || ' Baked fresh to order in small batches in our home kitchen. Best enjoyed within 2 days. (Sample description.)',
  CASE category WHEN 'cakes' THEN CASE WHEN slug LIKE 'custom%' THEN 'starting price' ELSE 'for 500 g' END WHEN 'gift-boxes' THEN 'per box' WHEN 'cheesecakes' THEN 'per slice' WHEN 'dessert-cups' THEN 'per cup' ELSE 'per piece' END,
  CASE category
    WHEN 'cakes' THEN jsonb_build_array(jsonb_build_object('id','500g','label','500 g','price',price*100), jsonb_build_object('id','1kg','label','1 kg','price',round(price*1.9)*100), jsonb_build_object('id','1.5kg','label','1.5 kg','price',round(price*2.8)*100))
    WHEN 'gift-boxes' THEN jsonb_build_array(jsonb_build_object('id','box','label','1 box','price',price*100))
    WHEN 'cheesecakes' THEN jsonb_build_array(jsonb_build_object('id','1','label','1 slice','price',price*100), jsonb_build_object('id','4','label','Set of 4','price',price*400))
    WHEN 'dessert-cups' THEN jsonb_build_array(jsonb_build_object('id','1','label','1 cup','price',price*100), jsonb_build_object('id','4','label','Set of 4','price',price*400))
    ELSE jsonb_build_array(jsonb_build_object('id','1','label','1 piece','price',price*100), jsonb_build_object('id','4','label','Box of 4','price',price*400), jsonb_build_object('id','6','label','Box of 6','price',round(price*6*0.95)*100)) END,
  CASE category WHEN 'cakes' THEN '[{"id":"candles","label":"Birthday candles","price":4900},{"id":"topper","label":"Cake topper","price":14900},{"id":"giftwrap","label":"Gift packaging","price":9900}]'::jsonb
    WHEN 'gift-boxes' THEN '[{"id":"giftwrap","label":"Gift packaging","price":9900}]'::jsonb ELSE '[]'::jsonb END,
  CASE WHEN slug LIKE 'custom%' THEN ARRAY['Chocolate','Vanilla','Red Velvet','Butterscotch'] END,
  category = 'cakes', category = 'gift-boxes', CASE WHEN category='cakes' THEN 3 ELSE 20 END, stock,
  CASE WHEN slug LIKE 'custom%' THEN 72 WHEN category='cakes' THEN 48 ELSE 24 END,
  'Flour, butter, sugar, chocolate, eggs, milk, vanilla. (Sample — to be verified by the baker.)',
  'Contains wheat (gluten), milk and egg. Prepared in a kitchen that handles nuts. (Sample — to be verified.)',
  featured, badge, rating, reviews, '/products/' || slug || '.jpg', sort
FROM s;