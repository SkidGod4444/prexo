import type {
  AddContextPayload,
  ResetOptions,
  SaveOperationResult,
  VectorPayload,
} from "../types";
import { DEFAULT_SIMILARITY_THRESHOLD, DEFAULT_TOP_K } from "../lib/constants";
import type { Index } from "@upstash/vector";
import { nanoid } from "nanoid";
import { scrapeContent } from "../lib/firecrawl";

// Helper function to chunk text
function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export class VectorDB {
  private index: Index;
  constructor(index: Index) {
    this.index = index;
  }

  async reset(options?: ResetOptions) {
    await this.index.reset({ namespace: options?.namespace });
  }

  async delete({ ids, namespace }: { ids: string[]; namespace?: string }) {
    await this.index.delete(ids, { namespace });
  }

  /**
   * A method that allows you to query the vector database with plain text.
   * It takes care of the text-to-embedding conversion by itself.
   * Additionally, it lets consumers pass various options to tweak the output.
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  async retrieve<TMetadata>({
    question,
    similarityThreshold = DEFAULT_SIMILARITY_THRESHOLD,
    topK = DEFAULT_TOP_K,
    namespace,
    contextFilter,
    queryMode,
  }: VectorPayload): Promise<
    { data: string; id: string; metadata: TMetadata }[]
  > {
    const index = this.index;
    const result = await index.query<Record<string, string>>(
      {
        ...(typeof question === "string"
          ? { data: question }
          : { vector: question }),
        topK,
        includeData: true,
        includeMetadata: true,
        ...(typeof contextFilter === "string" && { filter: contextFilter }),
        queryMode,
      },
      { namespace },
    );
    console.log("Vector Retrive: ", result)
    const allValuesUndefined = result.every(
      (embedding) => embedding.data === undefined,
    );

    if (allValuesUndefined) {
      console.error(
        "There is no answer for this question in the provided context.",
      );

      return [
        {
          data: "There is no answer for this question in the provided context.",
          id: "error",
          metadata: {} as TMetadata,
        },
      ];
    }

    const facts = result
      .filter((x) => x.score >= similarityThreshold)
      .map((embedding) => ({
        data: embedding.data ?? "",
        id: embedding.id.toString(),
        metadata: embedding.metadata as TMetadata,
      }));

    return facts;
  }

  /**
   * A method that allows you to add various data types into a vector database.
   * It supports plain text, embeddings, PDF, HTML, Text file and CSV. Additionally, it handles text-splitting for CSV, PDF and Text file.
   */
  async save(input: AddContextPayload): Promise<SaveOperationResult> {
    const { namespace } = input.options ?? {};
    if (input.type === "text") {
      try {
        const returnId = input.id ?? nanoid();
        await this.index.upsert(
          {
            data: input.data,
            id: returnId,
            metadata: input.options?.metadata,
          },
          { namespace },
        );

        return { success: true, ids: [returnId.toString()] };
      } catch (error) {
        return {
          success: false,
          error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        };
      }
    } else if (input.type === "embedding") {
      try {
        const returnId = input.id ?? nanoid();
        await this.index.upsert(
          {
            vector: input.data,
            data: input.text,
            id: returnId,
            metadata: input.options?.metadata,
          },
          { namespace },
        );

        return { success: true, ids: [returnId.toString()] };
      } catch (error) {
        return {
          success: false,
          error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        };
      }
    } else {
      try {
        // Determine the file source (string path or URL)
        let fileSource: string | undefined = undefined;
        if ("fileSource" in input && typeof input.fileSource === "string") {
          fileSource = input.fileSource;
        } else if ("source" in input && typeof input.source === "string") {
          fileSource = input.source;
        }
        if (!fileSource) {
          throw new Error("No valid file source provided for extractText");
        }

        // extractText should return a string (the extracted text)
        const res = await scrapeContent(fileSource);
        if (!res?.markdown && !res?.summary) {
          throw new Error("Failed to extract data from the provided source");
        }

        // chunk the extracted text
        const transformArgs = "config" in input ? input.config : {};
        // If transformArgs has chunkSize/overlap, use them, else default
        const chunkSize =
          (transformArgs && (transformArgs as any).chunkSize) || 500;
        const overlap =
          (transformArgs && (transformArgs as any).overlap) || 100;

        // Prefer markdown for chunking; fallbacks for possible shapes
        const markdown =
          (res as any).markdown ??
          (res as any)?.output?.markdown ??
          (res as any)?.output?.txt ??
          "";
        const summary =
          (res as any).summary ?? (res as any)?.output?.summary;

        const chunks = chunkText(markdown, chunkSize, overlap);

        // upsert each chunk
        const ids: string[] = [];
        for (const chunk of chunks) {
          const id = nanoid();
          await this.index.upsert(
            {
              data: chunk,
              id,
              metadata: {
                ...(input.options?.metadata ?? {}),
                ...(summary ? { summary } : {}),
              },
            },
            { namespace },
          );
          ids.push(id);
        }

        return { success: true, ids };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        };
      }
    }
  }
}
