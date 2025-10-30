import { GetLogs, TelegramMessageBuilder } from "getlogs-sdk";

const telegramConfig = {
  parseMode: "MarkdownV2" as const,
  disableWebPagePreview: true,
};

const logger = new GetLogs({
  provider: "telegram",
  telegram: {
    botToken: process.env.TG_BOT_TOKEN!,
    chatId: process.env.TG_CHAT_ID!,
    parseMode: telegramConfig.parseMode,
  },
});

interface TelegramLogParams {
  logTitle: string;
  logSummary: string;
  logType: string;
  severity: string;
  environment: string;
  timestamp?: string;
  stackTrace?: string;
  documentationUrl?: string;
}

function escapeMarkdown(text: string) {
    return text
      .replace(/_/g, '\\_')
      .replace(/\*/g, '\\*')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/~/g, '\\~')
      .replace(/`/g, '\\`')
      .replace(/>/g, '\\>')
      .replace(/#/g, '\\#')
      .replace(/\+/g, '\\+')
      .replace(/-/g, '\\-')
      .replace(/=/g, '\\=')
      .replace(/\|/g, '\\|')
      .replace(/{/g, '\\{')
      .replace(/}/g, '\\}')
      .replace(/\./g, '\\.')
      .replace(/!/g, '\\!');
  }

function buildTelegramLogMessage(params: TelegramLogParams) {
  const {
    logTitle,
    logSummary,
    logType,
    severity,
    environment,
    timestamp,
    stackTrace,
    documentationUrl,
  } = params;

  const builder = new TelegramMessageBuilder()
    .setParseMode(telegramConfig.parseMode)
    .setDisableWebPagePreview(telegramConfig.disableWebPagePreview)
    .setDisableNotification(severity !== "high") // Notify only for high severity
    .addBold(escapeMarkdown(logTitle))
    .addLineBreak()
    .addLineBreak()
    .setText(escapeMarkdown(logSummary))
    .addLineBreak()
    .addLineBreak()
    .addBold("Error Details:")
    .addLineBreak()
    .addCode(`Error Type: ${escapeMarkdown(logType)}`)
    .addLineBreak()
    .addCode(`Severity: ${escapeMarkdown(severity)}`)
    .addLineBreak()
    .addCode(`Environment: ${environment}`)
    .addLineBreak()
    .addCode(`Timestamp: ${timestamp ?? new Date().toISOString()}`)
    .addLineBreak()
    .addLineBreak()
    if (stackTrace) {
      builder
        .addBold("Stack Trace:")
        .addLineBreak()
        .addPreformatted(escapeMarkdown(stackTrace), "typescript");
    }

  if (documentationUrl) {
    builder
      .addLineBreak()
      .addLineBreak()
      .addLink("View Documentation", documentationUrl);
  }

  return builder;
}

export async function logTelegram(params: TelegramLogParams) {
  const message = buildTelegramLogMessage(params);
  await logger.log({ telegramMessage: message.toJSON().message });
}