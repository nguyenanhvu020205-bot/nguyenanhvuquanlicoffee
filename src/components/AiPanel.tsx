import { useState } from "react";
import { Coffee } from "lucide-react";
import { MessageResponse } from "@/components/ai-elements/message";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { businessData } from "@/lib/data";
import { snapshot } from "@/lib/store";

export type AiRunner = (args: { data: { text: string; context: string } }) => Promise<{
  text: string;
  error: string | null;
}>;

export function AiPanel({
  title,
  cta = "Tạo bằng AI",
  placeholder,
  emptyHint,
  run,
}: {
  title: string;
  cta?: string;
  placeholder?: string;
  emptyHint?: string;
  run: AiRunner;
}) {
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const go = async () => {
    if (placeholder && !input.trim()) {
      setError("Hãy nhập mô tả trước khi tạo gợi ý.");
      return;
    }
    setBusy(true);
    setError("");
    setResult("");
    try {
      const res = await run({ data: { text: input.trim(), context: businessData(snapshot()) } });
      if (res.error) setError(res.error);
      else if (res.text) setResult(res.text);
      else setError("AI chưa trả về kết quả, vui lòng thử lại.");
    } catch {
      setError("Không kết nối được máy chủ, vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-semibold text-primary">
          <Coffee className="size-4" /> {title}
        </h2>
        <button
          onClick={go}
          disabled={busy}
          className="rounded bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {busy ? "Đang xử lý…" : cta}
        </button>
      </div>
      {placeholder && (
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="mb-3 w-full rounded border bg-background p-2 text-sm outline-none focus:border-accent"
        />
      )}
      {busy && <Shimmer className="text-sm text-muted-foreground">AI đang phân tích dữ liệu quán…</Shimmer>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && (
        <div className="text-sm leading-relaxed [&_table]:my-2 [&_table]:w-full">
          <MessageResponse>{result}</MessageResponse>
        </div>
      )}
      {!result && !busy && !error && !placeholder && emptyHint && (
        <p className="text-sm text-muted-foreground">{emptyHint}</p>
      )}
    </div>
  );
}
