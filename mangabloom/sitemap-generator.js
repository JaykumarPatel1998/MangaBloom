// sitemap-generator.js
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
const routes = [
    { path: "/"},
    { path: "/manga/:id"},
  ];

const generateSitemap = async () => {
  const hostname = "https://yourwebsite.com"; // Replace with your domain
  const dynamicMangaIds = ["75ee72ab-c6bf-4b87-badd-de839156934c", "7f30dfc3-0b80-4dcc-a3b9-0cd746fac005", "c727d921-4294-455b-9bcc-2f0c7d29cd9a"]; // Replace with actual dynamic fetch logic

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
