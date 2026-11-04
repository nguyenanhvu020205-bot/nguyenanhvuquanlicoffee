import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { AppShell, Pill, Table, btn } from "@/components/AppShell";
import { AiPanel } from "@/components/AiPanel";
import { FormDialog } from "@/components/FormDialog";
import type { StockItem } from "@/lib/data";
import { useStore } from "@/lib/store";
import { goiYKhoAI } from "@/lib/ai/features.functions";

export const Route = createFileRoute("/kho")({
  head: () => ({ meta: [{ title: "Kho – HIVER" }, { name: "description", content: "Quản lý nguyên liệu tồn kho." }, { property: "og:title", content: "Kho – HIVER" }, { property: "og:description", content: "Quản lý nguyên liệu tồn kho." }] }),
  component: Kho,
});

function Kho() {
  const [edit, setEdit] = useState<Partial<StockItem> | null>(null);
  return (
    <AppShell title="Kho nguyên liệu" actions={<button className={btn.accent} onClick={() => setEdit({})}>+ Thêm nguyên liệu</button>}>
      <Body edit={edit} setEdit={setEdit} />
    </AppShell>
  );
}

function Body({ edit, setEdit }: { edit: Partial<StockItem> | null; setEdit: (v: Partial<StockItem> | null) => void }) {
  const { stock, menu, saveStock, removeStock, restock } = useStore();
  const [imp, setImp] = useState<StockItem | null>(null);
  const run = useServerFn(goiYKhoAI);
  const [onlyLow, setOnlyLow] = useState(false);
  const list = stock.filter((s) => !onlyLow || s.qty < s.min);

  return (
    <>
      <label className="mb-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} /> Chỉ hiện nguyên liệu sắp hết
      </label>
      <Table head={["Mã", "Nguyên liệu", "Đơn vị", "Tồn kho", "Tối thiểu", "Tình trạng", "Dùng cho", ""]}
        rows={list.map((s) => [
          s.id, <b>{s.name}</b>, s.unit, +s.qty.toFixed(2), s.min,
          <Pill tone={s.qty < s.min ? "bad" : "ok"}>{s.qty < s.min ? "Sắp hết" : "Đủ"}</Pill>,
          <span className="text-xs text-muted-foreground">{menu.filter((m) => m.recipe?.[s.id]).map((m) => m.name).join(", ") || "—"}</span>,
          <span className="flex gap-3">
            <button className={btn.link} onClick={() => setImp(s)}>Nhập kho</button>
            <button className={btn.link} onClick={() => setEdit(s)}>Sửa</button>
            <button className={btn.linkDanger} onClick={() => confirm(`Xóa "${s.name}"?`) && removeStock(s.id)}>Xóa</button>
          </span>,
        ])} />

      <FormDialog
        open={!!edit} onOpenChange={(v) => !v && setEdit(null)}
        title={edit?.id ? "Sửa nguyên liệu" : "Thêm nguyên liệu"}
        initial={{ name: edit?.name ?? "", unit: edit?.unit ?? "kg", qty: edit?.qty ?? 0, min: edit?.min ?? 0 }}
        fields={[
          { key: "name", label: "Tên nguyên liệu", required: true },
          { key: "unit", label: "Đơn vị", required: true },
          { key: "qty", label: "Tồn kho", type: "number", required: true },
          { key: "min", label: "Mức tối thiểu", type: "number", required: true },
        ]}
        onSubmit={(v) => saveStock({ id: edit?.id, name: String(v.name), unit: String(v.unit), qty: Number(v.qty), min: Number(v.min) })}
      />

      <FormDialog
        open={!!imp} onOpenChange={(v) => !v && setImp(null)}
        title={`Nhập kho: ${imp?.name ?? ""}`}
        initial={{ amount: "" }}
        fields={[{ key: "amount", label: `Số lượng nhập (${imp?.unit ?? ""})`, type: "number", required: true, min: 0.001 }]}
        onSubmit={(v) => { if (imp) { restock(imp.id, Number(v.amount)); toast.success(`Đã nhập ${v.amount} ${imp.unit} ${imp.name}`); } }}
      />

      <div className="mt-6">
        <AiPanel title="Nguyên liệu cần mua tuần tới (AI)" cta="Tính bằng AI" run={run}
          emptyHint="Bấm nút để AI tính danh sách nguyên liệu cần mua tuần tới dựa trên tồn kho và lượng bán thực tế." />
      </div>
    </>
  );
}
