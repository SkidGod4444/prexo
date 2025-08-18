import { prisma, PrismaClientKnownRequestError } from "@prexo/db";

export function generateContainerKey(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `con_${randomDigits}`;
}

export async function invalidateCache(tags: string[]) {
  try {
    await prisma.$accelerate.invalidate({
      tags
    });
  } catch (e: any) {
    if (
      typeof PrismaClientKnownRequestError !== "undefined" &&
      e instanceof PrismaClientKnownRequestError
    ) {
      if (e.code === "P6003") {
        console.log(
          "The cache invalidation rate limit has been reached. Please try again later."
        );
      }
    }
    throw e;
  }
}
