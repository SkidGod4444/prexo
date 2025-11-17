import { Anthropic } from "@svgs/anthropic";
import { DeepSeek } from "@svgs/deepseek";
import { Gemini } from "@svgs/gemini";
import { Meta } from "@svgs/meta";
import { OpenAI } from "@svgs/openai";
import { createElement, type SVGProps } from "react";

const PROVIDER_ICON_MAP = {
  openai: OpenAI,
  meta: Meta,
  google: Gemini,
  deepseek: DeepSeek,
  anthropic: Anthropic,
} as const;

type ProviderKey = keyof typeof PROVIDER_ICON_MAP;

export function modelProviderSVG(
  provider?: string,
  props?: SVGProps<SVGSVGElement>,
) {
  if (!provider) {
    return null;
  }

  const normalized = provider.toLowerCase() as ProviderKey;
  const Icon = PROVIDER_ICON_MAP[normalized];

  if (!Icon) {
    return null;
  }

  return createElement(Icon, props);
}
