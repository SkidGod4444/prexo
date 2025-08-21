import { prisma } from "@prexo/db";

export function generateContainerKey(): string {
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  return `con_${id}`;
}

export async function invalidateCache(tags: string[]) {
  try {
    await prisma.$accelerate.invalidate({ tags });
  } catch (e: any) {
    if (e && typeof e === "object" && "code" in e && e.code === "P6003") {
      console.log(
        "The cache invalidation rate limit has been reached. Please try again later.",
      );
    }
    throw e;
  }
}
