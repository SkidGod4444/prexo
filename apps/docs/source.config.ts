import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config";
import { remarkAutoTypeTable, createGenerator } from "fumadocs-typescript";
import {
  remarkNpm,
  remarkImage,
  rehypeCodeDefaultOptions,
} from "fumadocs-core/mdx-plugins";
import { transformerTwoslash } from "fumadocs-twoslash";

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

const generator = createGenerator();

export default defineConfig({
  lastModifiedTime: "git",
  mdxOptions: {
    remarkPlugins: [
      [remarkAutoTypeTable, { generator }],
      remarkImage,
      remarkNpm,
    ],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash(),
      ],
    },
  },
});
