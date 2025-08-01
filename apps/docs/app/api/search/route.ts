import { source } from "@/lib/source";
import { createSearchAPI } from "fumadocs-core/search/server";

export const { GET } = createSearchAPI("advanced", {
  // https://docs.orama.com/open-source/supported-languages
  language: "english",
  indexes: source.getPages().map((page) => ({
    title: page.data.title,
    description: page.data.description,
    content: page.data.content,
    url: page.url,
    id: page.url,
    structuredData: page.data.structuredData,
    tag: page.slugs.length <= 1 ? ["intro", "All"] : [page.slugs[0], "All"],
  })),
});
