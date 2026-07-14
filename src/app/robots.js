export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/profile/"],
    },
    sitemap: "https://workernear.com/sitemap.xml",
  };
}