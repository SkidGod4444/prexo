import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import * as FilesComponents from "fumadocs-ui/components/files";
import * as Twoslash from "fumadocs-twoslash/ui";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    ...Twoslash,
    ...FilesComponents,
    ...components,
  };
}
