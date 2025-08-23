const socials = {
  npm: "https://l.devwtf.in/npmXyZ",
  x: "https://l.devwtf.in/plura-x",
  discord: "https://l.devwtf.in/plura-dc",
  github: "https://git.new/prexo",
  docs: "https://docs.prexoai.xyz",
  changelogs: "https://changelogs.prexoai.xyz",
  sponsor: "https://l.devwtf.in/sponsor",
  me: "https://devwtf.in",
  myX: "https://l.devwtf.in/x",
  dashboard: "https://console.prexoai.xyz",
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
