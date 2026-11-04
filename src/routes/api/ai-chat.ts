import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createGateway, reasoningOptions } from "@/lib/ai/gateway.server";
import { assistantSystem } from "@/lib/ai/prompts.server";
import { getLovableAiGatewayRunId, withLovableAiGatewayRunIdHeader } from "@/lib/ai/run-id";

export const Route = createFileRoute("/api/ai-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: UIMessage[]; context?: string };
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (messages.length === 0) {
          return Response.json({ error: "Thiếu nội dung câu hỏi." }, { status: 400 });
        }

        const gw = createGateway(getLovableAiGatewayRunId(request));
        const result = streamText({
          model: gw.model,
          system: assistantSystem(String(body.context ?? "")),
          messages: await convertToModelMessages(messages),
          abortSignal: request.signal,
          maxRetries: 0,
          providerOptions: { openai: reasoningOptions },
        });

        return withLovableAiGatewayRunIdHeader(
          result.toUIMessageStreamResponse({
            originalMessages: messages,
            sendReasoning: true,
            onError: (error) => {
              console.error("[HIVER AI] Lỗi chat:", error);
              return "AI gặp sự cố, vui lòng thử lại sau ít phút.";
            },
          }),
          gw.runIdFetch,
        );
      },
    },
  },
});
