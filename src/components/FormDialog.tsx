import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { btn, inputCls } from "./AppShell";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "number" | "select" | "image";
  options?: string[];
  required?: boolean;
  min?: number;
  step?: number;
};

type Values = Record<string, string | number>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Out = any;

export function FormDialog({ open, onOpenChange, title, fields, initial, onSubmit }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  fields: Field[];
  initial: Record<string, string | number | undefined>;
  onSubmit: (v: Out) => string | void | undefined; // trả về chuỗi lỗi nếu không hợp lệ
}) {
  const [v, setV] = useState<Values>(initial as Values);
  const [err, setErr] = useState("");
  useEffect(() => { if (open) { setV(initial as Values); setErr(""); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            for (const f of fields) {
              const val = v[f.key];
              if (f.required && String(val ?? "").trim() === "") return setErr(`Vui lòng nhập ${f.label.toLowerCase()}.`);
              if (f.type === "number" && String(val ?? "").trim() !== "" && (isNaN(Number(val)) || Number(val) < (f.min ?? 0))) return setErr(`${f.label} không hợp lệ.`);
            }
            const out: Values = {};
            for (const f of fields) out[f.key] = f.type === "number" ? (String(v[f.key] ?? "").trim() === "" ? "" : Number(v[f.key])) : String(v[f.key] ?? "").trim();
            const e2 = onSubmit(out);
            if (e2) setErr(e2); else onOpenChange(false);
          }}
        >
          {fields.map((f) => (
            <label key={f.key} className="block text-sm font-medium">
              {f.label}
              {f.type === "image" ? (
                <ImagePicker value={String(v[f.key] ?? "")} onChange={(val) => setV({ ...v, [f.key]: val })} />
              ) : f.type === "select" ? (
                <select className={`${inputCls} mt-1`} value={String(v[f.key] ?? "")} onChange={(e) => setV({ ...v, [f.key]: e.target.value })}>
                  {f.options?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  className={`${inputCls} mt-1`}
                  type={f.type === "number" ? "number" : "text"}
                  step={f.step ?? (f.type === "number" ? "any" : undefined)}
                  min={f.min}
                  value={String(v[f.key] ?? "")}
                  onChange={(e) => setV({ ...v, [f.key]: e.target.value })}
                />
              )}
            </label>
          ))}
          {err && <p className="text-sm text-destructive">{err}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className={btn.ghost} onClick={() => onOpenChange(false)}>Hủy</button>
            <button className={btn.primary}>Lưu</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Chọn ảnh từ máy, thu nhỏ còn tối đa 400px để lưu nhẹ trong trình duyệt
function ImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const pick = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 400 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
      onChange(c.toDataURL("image/jpeg", 0.85));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };
  return (
    <div className="mt-1 flex items-center gap-3">
      {value
        ? <img src={value} alt="" className="h-16 w-16 rounded-md border object-cover" />
        : <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed text-[10px] text-muted-foreground">Chưa có</div>}
      <span className={`${btn.ghost} cursor-pointer`}>
        {value ? "Đổi ảnh" : "Chọn ảnh từ máy"}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      </span>
      {value && <button type="button" className={btn.linkDanger} onClick={() => onChange("")}>Bỏ ảnh</button>}
    </div>
  );
}
