import { createOpenAI } from "@ai-sdk/openai";
import { createLovableAiGatewayRunIdFetch } from "./run-id";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
export const CHAT_MODEL = "openai/gpt-6-astra";

export function createGateway(initialRunId?: string) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    throw new Error("Máy chủ chưa có khoá AI của Lovable (LOVABLE_API_KEY).");
  }
  const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  return { provider, runIdFetch, model: provider.responses(CHAT_MODEL) };
}

export const reasoningOptions = {
  store: false,
  forceReasoning: true,
  reasoningEffort: "medium" as const,
  reasoningSummary: "auto" as const,
  include: ["reasoning.encrypted_content" as const],
};

export function describeGatewayError(error: unknown): string {
  const err = error as { statusCode?: number; message?: string; responseBody?: string };
  let detail = "";
  if (err?.responseBody) {
    try {
      detail = String(JSON.parse(err.responseBody).message ?? "");
    } catch {
      detail = "";
    }
  }
  const status = err?.statusCode;
  if (status === 401) return "AI chưa được cấu hình đúng trên máy chủ. Vui lòng thử lại sau.";
  if (status === 402) return detail || "Hết hạn mức AI của tháng này. Cần nâng cấp gói để dùng tiếp.";
  if (status === 403) return detail || "AI từ chối yêu cầu này.";
  if (status === 404) return "Tính năng AI hiện không khả dụng. Vui lòng thử lại sau.";
  if (status === 429) return "AI đang quá tải, vui lòng thử lại sau ít phút.";
  if (status && status >= 500) return "Dịch vụ AI tạm thời gặp sự cố, vui lòng thử lại sau ít phút.";
  return detail || (err?.message?.slice(0, 200)) || "Có lỗi khi gọi AI, vui lòng thử lại.";
}
