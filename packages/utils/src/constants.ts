const socials = {
  npm: "https://l.devwtf.in/npmXyZ",
  x: "https://l.devwtf.in/plura-x",
  discord: "https://l.devwtf.in/plura-dc",
  github: "https://git.new/prexo",
  docs: "https://docs.prexoai.xyz",
  changelogs: "https://changelogs.prexoai.xyz",
  status: "https://status.prexoai.xyz",
  sponsor: "https://l.devwtf.in/sponsor",
  me: "https://devwtf.in",
  myX: "https://l.devwtf.in/x",
  dashboard: "https://app.prexoai.xyz",
};

const logoUrl =
  "https://bqg1lznd8n.ufs.sh/f/gqK0LVQDoyuw7sESAXos1YawOJpiue2bSzn06vylhGBx5kmg";

const pricingModels = [
  {
    productId: "0",
    label: "Free",
    amount: 0,
    features: [
      "Create unlimited projects.",
      "Remove watermarks.",
      "Add unlimited users and free viewers.",
      "Upload unlimited files.",
      "7-day money back guarantee.",
      "Advanced permissions.",
    ],
  },
  {
    productId: "40aaafdf-3ebc-44fe-b11b-883e610a363b",
    label: "Premium",
    amount: 19,
    features: [
      "Create unlimited projects.",
      "Remove watermarks.",
      "Add unlimited users and free viewers.",
      "Upload unlimited files.",
      "7-day money back guarantee.",
      "Advanced permissions.",
    ],
  },
];

const AI_MODELS_PRO_TIER = [
  {
    id: "gpt-5-mini",
    model: "gpt-5-mini",
    name: "GPT-5 Mini",
    provider: "openai",
    marketplace: "mega-llm",
    pricing: [
      {
        input: "0.75",
        output: "6.00"
      }
    ],
    context: "128",
    description: "Advanced language model with superior reasoning capabilities"
  },
  {
    id: "gpt-4o-mini",
    model: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    marketplace: "mega-llm",
    pricing: [
      {
        input: "0.45",
        output: "1.8"
      }
    ],
    context: "128",
    description: "Advanced language model with superior reasoning capabilities"
  },
  {
    id: "llama3.3-70b-instruct",
    model: "llama3.3-70b-instruct",
    name: "Llama 3.3 Instruct (70B)",
    provider: "meta",
    marketplace: "mega-llm",
    pricing: [
      {
        input: "0.36",
        output: "0.90"
      }
    ],
    context: "131",
    description: "Open-source large language model"
  },
  {
    id: "llama3-8b-instruct",
    model: "llama3-8b-instruct",
    name: "Llama 3.1 Instruct (8B)",
    provider: "meta",
    marketplace: "mega-llm",
    pricing: [
      {
        input: "0.90",
        output: "1.80"
      }
    ],
    context: "8",
    description: "Open-source large language model"
  },
  {
    id: "openai-gpt-oss-20b",
    model: "openai-gpt-oss-20b",
    name: "OpenAI GPT OSS 20b",
    provider: "meta",
    marketplace: "mega-llm",
    pricing: [
      {
        input: "0.21",
        output: "0.90"
      }
    ],
    context: "128",
    description: "Open-source large language model"
  },
  {
    id: "openai-gpt-oss-120b",
    model: "openai-gpt-oss-120b",
    name: "OpenAI GPT OSS 120b",
    provider: "openai",
    marketplace: "mega-llm",
    pricing: [
      {
        input: "0.45",
        output: "1.8"
      }
    ],
    context: "128",
    description: "Advanced language model with superior reasoning capabilities"
  },
  {
    id: "deepseek-r1-distill-llama-70b",
    model: "deepseek-r1-distill-llama-70b",
    name: "DeepSeek R1 Distill Llama 70B",
    provider: "deepseek",
    marketplace: "mega-llm",
    pricing: [
      {
        input: "2.25",
        output: "2.97"
      }
    ],
    context: "128",
    description: "Open-source large language model"
  },
  {
    id: "gemini-2.5-flash",
    model: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    marketplace: "mega-llm",
    pricing: [
      {
        input: "3",
        output: "3"
      }
    ],
    context: "196",
    description: "Open-source large language model"
  },
  {
    id: "claude-haiku-4-5-20251001",
    model: "claude-haiku-4-5-20251001",
    name: "Claude Haiku 4.5",
    provider: "anthropic",
    marketplace: "mega-llm",
    pricing: [
      {
        input: "3.00",
        output: "15.00"
      }
    ],
    context: "128",
    description: "Claude Haiku 4.5 - Advanced AI model"
  }
];

const AI_MODELS_FREE_TIER = [
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    model: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat V3 (Free)",
    provider: "deepseek",
    marketplace: "openrouter",
    description:
      "A powerful open-source chat model by DeepSeek, suitable for general-purpose conversations.",
  },
  {
    id: "openai/gpt-oss-20b:free",
    model: "openai/gpt-oss-20b:free",
    name: "OpenAI GPT-OSS 20B (Free)",
    provider: "openai",
    marketplace: "openrouter",
    description:
      "An open-source 20B parameter model by OpenAI, ideal for a wide range of chat and completion tasks.",
  },
  {
    id: "meta-llama/Llama-3.3-70B-Instruct-Turbo:free",
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
    name: "Meta Llama 3.3 70B Instruct Turbo (Free)",
    provider: "meta",
    marketplace: "togetherai",
    description:
      "A high-performance 70B parameter model by Meta, optimized for instruction-following tasks.",
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    model: "google/gemini-2.0-flash-exp:free",
    name: "Google Gemini 2.0 Flash Exp (Free)",
    provider: "google",
    marketplace: "openrouter",
    description:
      "An experimental model by Google, designed for fast and efficient instruction tasks.",
  },
  {
    id: "google/gemma-3n-e4b-it:free",
    model: "google/gemma-3n-e4b-it:free",
    name: "Google Gemma 3N E4B Instruct (Free)",
    provider: "google",
    marketplace: "openrouter",
    description:
      "A multilingual model by Google, designed for instruction tasks across various languages.",
  },
  {
    id: "mistralai/mistral-small-3.2-24b-instruct:free",
    model: "mistralai/mistral-small-3.2-24b-instruct:free",
    name: "Mistral Small 3.2 24B Instruct (Free)",
    provider: "mistral ai",
    marketplace: "openrouter",
    description:
      "A compact yet powerful 24B parameter model by Mistral, designed for instruction-following tasks.",
  },
] as const;

export { socials, pricingModels, logoUrl, AI_MODELS_FREE_TIER };
