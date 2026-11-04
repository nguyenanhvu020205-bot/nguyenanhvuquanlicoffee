import { createServerFn } from "@tanstack/react-start";
import type { AiResult } from "./features.server";

const toText = (input?: { text?: string; context?: string }) => ({
  text: String(input?.text ?? "").trim().slice(0, 2000),
  context: String(input?.context ?? "").slice(0, 20000),
});

export const taoBaoCaoAI = createServerFn({ method: "POST" })
  .inputValidator(toText)
  .handler(async ({ data }): Promise<AiResult> => {
    const { runAi, assistantSystem, reportPrompt } = await import("./features.server");
    return runAi(assistantSystem(data.context), reportPrompt());
  });

export const goiYMenuAI = createServerFn({ method: "POST" })
  .inputValidator(toText)
  .handler(async ({ data }): Promise<AiResult> => {
    const { runAi, assistantSystem, menuIdeasPrompt } = await import("./features.server");
    return runAi(assistantSystem(data.context), menuIdeasPrompt());
  });

export const goiYKhoAI = createServerFn({ method: "POST" })
  .inputValidator(toText)
  .handler(async ({ data }): Promise<AiResult> => {
    const { runAi, assistantSystem, stockPrompt } = await import("./features.server");
    return runAi(assistantSystem(data.context), stockPrompt());
  });

export const goiYMonAI = createServerFn({ method: "POST" })
  .inputValidator(toText)
  .handler(async ({ data }): Promise<AiResult> => {
    if (!data.text) {
      return { text: "", error: "Hãy mô tả khách muốn gì trước." };
    }
    const { runAi, assistantSystem, salesPrompt } = await import("./features.server");
    return runAi(assistantSystem(data.context), salesPrompt(data.text));
  });
