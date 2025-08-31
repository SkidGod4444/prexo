import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const is_DEV = process.env.NODE_ENV === "development";
export const BASE_API_ENDPOINT = is_DEV
  ? "http://localhost:3001/v1/sdk"
  : "https://api.prexoai.xyz/v1/sdk";
