import brownies from "@/assets/brownies.jpg";
import cookies from "@/assets/cookies.jpg";
import cupcakes from "@/assets/cupcakes.jpg";
import cakes from "@/assets/cakes.jpg";
import cheesecakes from "@/assets/cheesecakes.jpg";
import giftboxes from "@/assets/giftboxes.jpg";
import hero from "@/assets/hero.jpg";

export type CategorySlug = "cakes" | "brownies" | "cookies" | "cupcakes" | "cheesecakes" | "dessert-cups" | "gift-boxes";

export const categories: { slug: CategorySlug; name: string; blurb: string; image: string }[] = [
  { slug: "cakes", name: "Celebration Cakes", blurb: "Layered, frosted and made for the big day.", image: cakes },
  { slug: "brownies", name: "Brownies", blurb: "Fudgy centres, crackly tops.", image: brownies },
  { slug: "cookies", name: "Cookies", blurb: "Golden edges, gooey middles.", image: cookies },
  { slug: "cupcakes", name: "Cupcakes", blurb: "Little cakes, big swirls.", image: cupcakes },
  { slug: "cheesecakes", name: "Cheesecakes", blurb: "Creamy, silky, slice-worthy.", image: cheesecakes },
  { slug: "dessert-cups", name: "Dessert Cups", blurb: "Layered little jars of joy.", image: "/products/tiramisu-dessert-cup.jpg" },
  { slug: "gift-boxes", name: "Dessert Gift Boxes", blurb: "Sweetness, beautifully boxed.", image: giftboxes },
];

export type Variant = { id: string; label: string; price: number }; // price in paise
export type Addon = { id: string; label: string; price: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  short: string;
  description: string;
  unit: string;
  variants: Variant[];
  flavours?: string[];
  addons?: Addon[];
  allowsMessage?: boolean;
  allowsGiftNote?: boolean;
  minQty: number;
  maxQty: number;
  available: boolean;
  prepHours: number;
  ingredients: string;
  allergens: string;
  containsEgg: boolean;
  featured?: boolean;
  badge?: "Bestseller" | "New";
  rating: number;
  reviews: number;
  image: string;
  createdAt: number;
};


const rs = (n: number) => n * 100;
const pieces = (unit: number): Variant[] => [
  { id: "1", label: "1 piece", price: rs(unit) },
  { id: "4", label: "Box of 4", price: rs(unit * 4) },
  { id: "6", label: "Box of 6", price: rs(Math.round(unit * 6 * 0.95)) },
];
const cakeSizes = (half: number): Variant[] => [
  { id: "500g", label: "500 g", price: rs(half) },
  { id: "1kg", label: "1 kg", price: rs(Math.round(half * 1.9)) },
  { id: "1.5kg", label: "1.5 kg", price: rs(Math.round(half * 2.8)) },
];
const cakeAddons: Addon[] = [
  { id: "candles", label: "Birthday candles", price: rs(49) },
  { id: "topper", label: "Cake topper", price: rs(149) },
  { id: "giftwrap", label: "Gift packaging", price: rs(99) },
];
const boxAddons: Addon[] = [{ id: "giftwrap", label: "Gift packaging", price: rs(99) }];

const SAMPLE = " (Sample information — to be verified by the baker.)";

type Seed = [string, CategorySlug, number, string, Partial<Product>?];
const seeds: Seed[] = [
  ["Classic Fudge Brownie", "brownies", 120, "Dense, fudgy and deeply chocolatey.", { badge: "Bestseller", featured: true }],
  ["Triple Chocolate Brownie", "brownies", 150, "Dark, milk and white chocolate in every bite."],
  ["Walnut Chocolate Brownie", "brownies", 160, "Toasted walnuts folded into a fudgy base.", { allergens: "Wheat (gluten), milk, egg, tree nuts (walnut)." }],
  ["Salted Caramel Brownie", "brownies", 170, "A ribbon of salted caramel through dark chocolate.", { featured: true, badge: "New" }],
  ["Classic Chocolate Chip Cookie", "cookies", 90, "Crisp edges, chewy centre, pools of chocolate.", { featured: true, badge: "Bestseller" }],
  ["Double Chocolate Cookie", "cookies", 110, "Cocoa dough loaded with dark chocolate chunks."],
  ["Red Velvet Cookie", "cookies", 120, "Soft red velvet with white chocolate chips."],
  ["Sea Salt Chocolate Cookie", "cookies", 120, "Brown butter, dark chocolate, flaky sea salt.", { badge: "New" }],
  ["Belgian Chocolate Cupcake", "cupcakes", 140, "Moist chocolate sponge, silky ganache swirl.", { featured: true }],
  ["Vanilla Bean Cupcake", "cupcakes", 120, "Light vanilla sponge with buttercream."],
  ["Red Velvet Cupcake", "cupcakes", 150, "Classic red velvet with cream cheese frosting."],
  ["Salted Caramel Cupcake", "cupcakes", 160, "Caramel-filled sponge, salted caramel frosting."],
  ["Chocolate Truffle Cake", "cakes", 799, "Layers of chocolate sponge and truffle ganache.", { featured: true, badge: "Bestseller" }],
  ["Classic Vanilla Celebration Cake", "cakes", 699, "Vanilla sponge with whipped vanilla cream."],
  ["Red Velvet Cake", "cakes", 899, "Velvety layers with cream cheese frosting."],
  ["Chocolate Overload Cake", "cakes", 999, "Ganache, chocolate shards and a drip finish."],
  ["Fresh Fruit Cake", "cakes", 899, "Light sponge, fresh cream and seasonal fruit."],
  ["Custom Celebration Cake", "cakes", 1299, "Designed with you, for your celebration.", { prepHours: 72 }],
  ["Baked New York Cheesecake", "cheesecakes", 220, "Rich, creamy and baked low and slow."],
  ["Blueberry Cheesecake", "cheesecakes", 240, "Creamy cheesecake with blueberry compote.", { featured: true }],
  ["Alphonso Mango Cheesecake", "cheesecakes", 260, "Silky cheesecake crowned with mango glaze.", { badge: "New" }],
  ["Lotus Biscoff Cheesecake", "cheesecakes", 260, "Spiced biscuit base, Biscoff swirl and crumbs."],
  ["Tiramisu Dessert Cup", "dessert-cups", 220, "Coffee-soaked layers and mascarpone cream.", { featured: true }],
  ["Chocolate Mousse Cup", "dessert-cups", 180, "Airy dark chocolate mousse."],
  ["Banoffee Dessert Cup", "dessert-cups", 200, "Banana, toffee and whipped cream on a biscuit crumb."],
  ["Strawberry Shortcake Cup", "dessert-cups", 210, "Vanilla sponge, fresh strawberries and cream."],
  ["Brownie Gift Box", "gift-boxes", 499, "Six assorted brownies, beautifully boxed.", { featured: true }],
  ["Cookie Celebration Box", "gift-boxes", 399, "Eight assorted cookies for sharing."],
  ["Mixed Dessert Box", "gift-boxes", 699, "Brownies, cookies and mini cupcakes together.", { badge: "Bestseller" }],
  ["Mini Celebration Dessert Box", "gift-boxes", 549, "A petite assortment for small celebrations."],
];

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const seedProducts: Product[] = seeds.map(([name, category, price, short, extra = {}], i) => {
  const isCake = category === "cakes";
  const isBox = category === "gift-boxes";
  const isSlice = category === "cheesecakes" || category === "dessert-cups";
  const variants = isCake
    ? cakeSizes(price)
    : isBox
      ? [{ id: "box", label: "1 box", price: rs(price) }]
      : isSlice
        ? [{ id: "1", label: name.includes("Cup") ? "1 cup" : "1 slice", price: rs(price) }, { id: "4", label: "Set of 4", price: rs(price * 4) }]
        : pieces(price);
  return {
    id: `p${String(i + 1).padStart(3, "0")}`,
    slug: slugify(name),
    name,
    category,
    short,
    description: `${short} Baked fresh to order in small batches at our home kitchen, ${name} is made for everyday indulgence and special moments alike. Best enjoyed within 2 days of delivery.`,
    unit: isCake ? (name.startsWith("Custom") ? "starting price" : "for 500 g") : isBox ? "per box" : isSlice ? (name.includes("Cup") ? "per cup" : "per slice") : "per piece",
    variants,
    flavours: isCake && name.startsWith("Custom") ? ["Chocolate", "Vanilla", "Red Velvet", "Butterscotch"] : undefined,
    addons: isCake ? cakeAddons : isBox ? boxAddons : undefined,
    allowsMessage: isCake,
    allowsGiftNote: isBox,
    minQty: 1,
    maxQty: isCake ? 3 : 20,
    available: name !== "Fresh Fruit Cake",
    prepHours: isCake ? 48 : 24,
    ingredients: "Flour, butter, sugar, chocolate, eggs, milk, vanilla." + SAMPLE,
    allergens: "Contains wheat (gluten), milk and egg. Prepared in a kitchen that handles nuts." + SAMPLE,
    containsEgg: true,
    rating: Math.round((4.5 + ((i * 7) % 5) / 10) * 10) / 10,
    reviews: 18 + ((i * 13) % 90),
    image: `/products/${slugify(name)}.jpg`,
    createdAt: i,
    ...extra,
  } as Product;
});

export const heroImage = hero;
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const formatINR = (paise: number) =>
  "₹" + (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 });
