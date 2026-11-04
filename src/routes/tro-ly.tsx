import { useEffect, useMemo } from "react";
import { createFileRoute, useHydrated } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Coffee } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { businessData } from "@/lib/data";
import { snapshot } from "@/lib/store";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

export const Route = createFileRoute("/tro-ly")({
  head: () => ({
    meta: [
      { title: "Trợ lý AI – HIVER" },
      { name: "description", content: "Trợ lý AI hỏi đáp về doanh thu, menu và kho của quán." },
      { property: "og:title", content: "Trợ lý AI – HIVER" },
      { property: "og:description", content: "Trợ lý AI hỏi đáp về doanh thu, menu và kho của quán." },
    ],
  }),
  component: TroLy,
});

const STORAGE_KEY = "guinn-ai-chat";

function loadHistory(): UIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

const SUGGESTIONS = [
  "Món nào bán chạy nhất?",
  "Doanh thu 7 ngày qua thế nào?",
  "Nguyên liệu nào sắp hết cần mua?",
];

function TroLy() {
  const hydrated = useHydrated();
  return (
    <AppShell title="Trợ lý AI">
      <div className="flex h-[70vh] flex-col overflow-hidden rounded-lg border bg-card">
        {hydrated ? (
          <ChatWindow />
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">Đang tải…</div>
        )}
      </div>
    </AppShell>
  );
}

function ChatWindow() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/ai-chat", body: () => ({ context: businessData(snapshot()) }) }), []);
  const { messages, sendMessage, status, stop, error, setMessages } = useChat({
    transport,
    messages: loadHistory(),
  });

  useEffect(() => {
    if (status === "ready") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        /* trình duyệt chặn lưu — bỏ qua */
      }
    }
  }, [messages, status]);

  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 && (
            <ConversationEmptyState
              icon={<Coffee className="size-10 text-primary" />}
              title="Trợ lý HIVER"
              description="Hỏi mình về doanh thu, món bán chạy, kho nguyên liệu của quán."
            />
          )}
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.parts
                  .filter((p) => p.type === "text")
                  .map((p, i) => (
                    <MessageResponse key={i}>{p.text}</MessageResponse>
                  ))}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && (
            <Shimmer className="px-2 text-sm text-muted-foreground">Trợ lý đang soạn trả lời…</Shimmer>
          )}
          {messages.length === 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage({ text: s })}
                  className="rounded-full border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground hover:border-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      {error && <div className="px-4 pb-1 text-sm text-destructive">{error.message}</div>}
      <div className="border-t p-3">
        <PromptInput
          onSubmit={({ text }) => {
            if (text?.trim()) sendMessage({ text });
          }}
        >
          <PromptInputTextarea
            autoFocus
            placeholder="Hỏi về doanh thu, món bán chạy, kho…"
          />
          <PromptInputFooter className="items-center justify-between">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem(STORAGE_KEY);
                } catch {
                  /* bỏ qua */
                }
                setMessages([]);
              }}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Xoá hội thoại
            </button>
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
