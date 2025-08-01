"use client";
import { useDocsSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  TagsList,
  TagsListItem,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { useI18n } from "fumadocs-ui/contexts/i18n";
import { useState } from "react";

export default function PrexoSearchDialog(props: SharedProps) {
  const { locale } = useI18n(); // (optional) for i18n
  const [tag, setTag] = useState<string | undefined>("All");
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    locale,
    tag,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
        <SearchDialogFooter className="flex flex-row items-center justify-between">
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">Filters:</span>
            <TagsList tag={tag} onTagChange={setTag} allowClear>
              <TagsListItem value="intro">Introduction</TagsListItem>
              <TagsListItem value="ai-chat-sdk">AI Chat SDK</TagsListItem>
              <TagsListItem value="api">Prexo API</TagsListItem>
            </TagsList>
          </div>

          <span className="text-sm text-muted-foreground">
            Powered by{" "}
            <a
              href="https://prexoai.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Prexo AI
            </a>
          </span>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
