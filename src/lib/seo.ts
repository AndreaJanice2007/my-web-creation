export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} | A Pinch of Home` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | A Pinch of Home` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
