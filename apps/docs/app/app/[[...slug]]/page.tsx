import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
  EditOnGitHub,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getMDXComponents } from "@/mdx-components";
import { Rate } from "@/components/custom/rate";
import posthog from "posthog-js";
import { getLastEdit } from "@/lib/utils";
import { Breadcrumb } from "@/components/custom/breadcrumb";
import { LLMCopyButton, ViewOptions } from "@/components/custom/page-actions";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  let lastEdit: Date | null;
  if (process.env.NODE_ENV === "development") {
    lastEdit = new Date();
  } else {
    lastEdit = await getLastEdit(page.path);
  }

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{
        enabled: true,
        component: <Breadcrumb tree={source.pageTree} />,
      }}
      tableOfContent={{
        enabled: true,
        style: "clerk",
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-2">
        {page.data.description}
      </DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
        <ViewOptions
          markdownUrl={`${page.url}.mdx`}
          githubUrl={`https://github.com/SkidGod4444/prexo/tree/main/apps/docs/content/docs/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      <Rate
        onRateAction={async (url, feedback) => {
          "use server";
          posthog.capture("on_rate_docs", feedback);
          return { success: true, discordUrl: url };
        }}
      />
      <DocsBody className="flex items-center justify-between">
        <p className="text-sm text-fd-muted-foreground">
          Last updated on {lastEdit && lastEdit.toLocaleDateString()}
        </p>
        <EditOnGitHub
          href={`https://github.com/SkidGod4444/prexo/tree/main/apps/docs/content/docs/${page.path}`}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();
  const image = ["/docs-og", ...slug, "image.png"].join("/");
  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      images: image,
    },
  };
}
