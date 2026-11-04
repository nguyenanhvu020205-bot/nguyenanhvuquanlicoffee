import { streamText } from "ai";
import { createGateway, describeGatewayError, reasoningOptions } from "./gateway.server";
import {
  assistantSystem,
  menuIdeasPrompt,
  reportPrompt,
  salesPrompt,
  stockPrompt,
} from "./prompts.server";

export type AiResult = { text: string; error: string | null };

export async function runAi(system: string, prompt: string): Promise<AiResult> {
  try {
    const gw = createGateway();
    const result = streamText({
      model: gw.model,
      system,
      prompt,
      maxRetries: 0,
      providerOptions: { openai: reasoningOptions },
    });
    return { text: (await result.text).trim(), error: null };
  } catch (error) {
    console.error("[HIVER AI] Lỗi gọi AI:", error);
    return { text: "", error: describeGatewayError(error) };
  }
}

export {
  assistantSystem,
  menuIdeasPrompt,
  reportPrompt,
  salesPrompt,
  stockPrompt,
};
