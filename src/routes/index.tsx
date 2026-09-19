import { createFileRoute } from "@tanstack/react-router";
import PortfolioPage from "@/components/portfolio/PortfolioPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ManojRaj — Full Stack Developer" },
      { name: "description", content: "Manoj Raj is a Full Stack Developer building scalable web applications, ERP systems and SaaS products with React, Node.js and MSSQL." },
      { property: "og:title", content: "ManojRaj — Full Stack Developer" },
      { property: "og:description", content: "Engineering scalable web applications, ERP systems and SaaS products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});
