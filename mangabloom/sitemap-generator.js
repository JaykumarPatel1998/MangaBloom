// sitemap-generator.js
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
const routes = [
    { path: "/"},
    { path: "/manga/:id"},
  ];

const generateSitemap = async () => {
  const hostname = "https://yourwebsite.com"; // Replace with your domain
  const dynamicMangaIds = ["one-piece", "attack-on-titan", "naruto"]; // Replace with actual dynamic fetch logic

  const sitemap = new SitemapStream({ hostname });
  const writeStream = createWriteStream("./public/sitemap.xml");

  sitemap.pipe(writeStream);

  // Add static routes
  routes.forEach((route) => {
    if (!route.path.includes(":")) {
      sitemap.write({ url: route.path, changefreq: "daily", priority: 1.0 });
    }
  });

  // Add dynamic routes
  dynamicMangaIds.forEach((id) => {
    sitemap.write({
      url: `/manga/${id}`,
      changefreq: "weekly",
      priority: 0.8,
    });
  });

  sitemap.end();
  await streamToPromise(sitemap);
  console.log("Sitemap successfully generated!");
};

generateSitemap().catch((error) => {
  console.error("Error generating sitemap:", error);
});
