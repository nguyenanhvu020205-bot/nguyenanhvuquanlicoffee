import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell, Table, btn } from "@/components/AppShell";
import { AiPanel } from "@/components/AiPanel";
import { FormDialog } from "@/components/FormDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATS, vnd, type MenuItem } from "@/lib/data";
import { useStore } from "@/lib/store";
import { goiYMenuAI } from "@/lib/ai/features.functions";

export const Route = createFileRoute("/menu")({
  head: () => ({ meta: [{ title: "Menu – HIVER" }, { name: "description", content: "Danh sách món và giá." }, { property: "og:title", content: "Menu – HIVER" }, { property: "og:description", content: "Danh sách món và giá." }] }),
  component: Menu,
});

function Menu() {
  const [edit, setEdit] = useState<Partial<MenuItem> | null>(null);
  return (
    <AppShell title="Menu & công thức" actions={<button className={btn.accent} onClick={() => setEdit({ cat: CATS[0], recipe: {} })}>+ Thêm món</button>}>
      <Body edit={edit} setEdit={setEdit} />
    </AppShell>
  );
}

function Body({ edit, setEdit }: { edit: Partial<MenuItem> | null; setEdit: (v: Partial<MenuItem> | null) => void }) {
  const { menu, stock, saveMenu, removeMenu } = useStore();
  const [recipeOf, setRecipeOf] = useState<MenuItem | null>(null);
  const run = useServerFn(goiYMenuAI);

  return (
    <>
      <Table head={["#", "Tên món", "Danh mục", "Giá M", "Giá L", "Công thức", ""]}
        rows={menu.map((m) => [
          m.id,
          <b>{m.name}</b>, m.cat, vnd(m.price), m.priceL ? vnd(m.priceL) : "—",
          <button className={btn.link} onClick={() => setRecipeOf(m)}>{Object.keys(m.recipe ?? {}).length} nguyên liệu</button>,
          <span className="flex gap-3">
            <button className={btn.link} onClick={() => setEdit(m)}>Sửa</button>
            <button className={btn.linkDanger} onClick={() => confirm(`Xóa món "${m.name}"?`) && removeMenu(m.id)}>Xóa</button>
          </span>,
        ])} />

      <FormDialog
        open={!!edit} onOpenChange={(v) => !v && setEdit(null)}
        title={edit?.id ? "Sửa món" : "Thêm món"}
        initial={{ name: edit?.name ?? "", cat: edit?.cat ?? CATS[0], price: edit?.price ?? "", priceL: edit?.priceL ?? "", image: edit?.image ?? "" }}
        fields={[
          { key: "name", label: "Tên món", required: true },
          { key: "cat", label: "Danh mục", type: "select", options: CATS },
          { key: "price", label: "Giá Size M (đ)", type: "number", required: true, min: 1000, step: 1000 },
          { key: "priceL", label: "Giá Size L (đ) — bỏ trống nếu chỉ có 1 size", type: "number", min: 1000, step: 1000 },
          { key: "image", label: "Ảnh món (bấm để chọn ảnh trong máy)", type: "image" },
        ]}
        onSubmit={(v) => {
          const name = String(v.name);
          if (menu.some((m) => m.name.toLowerCase() === name.toLowerCase() && m.id !== edit?.id)) return "Tên món đã tồn tại.";
          saveMenu({ id: edit?.id, name, cat: String(v.cat), price: Number(v.price), priceL: v.priceL === "" ? undefined : Number(v.priceL), image: String(v.image ?? ""), recipe: edit?.recipe ?? {} });
          return undefined;
        }}
      />

      <Dialog open={!!recipeOf} onOpenChange={(v) => !v && setRecipeOf(null)}>
        <DialogContent>
          {recipeOf && <RecipeEditor item={recipeOf} stock={stock} onSave={(recipe) => { saveMenu({ ...recipeOf, recipe }); setRecipeOf(null); }} />}
        </DialogContent>
      </Dialog>

      <div className="mt-6">
        <AiPanel title="Gợi ý món mới bằng AI" cta="Gợi ý món mới" run={run}
          emptyHint="Bấm nút để AI đề xuất món mới kèm giá và mô tả bán hấp dẫn, dựa trên menu hiện tại." />
      </div>
    </>
  );
}

function RecipeEditor({ item, stock, onSave }: { item: MenuItem; stock: { id: string; name: string; unit: string }[]; onSave: (r: Record<string, number>) => void }) {
  const [r, setR] = useState<Record<string, string>>(Object.fromEntries(Object.entries(item.recipe ?? {}).map(([k, v]) => [k, String(v)])));
  return (
    <>
      <DialogHeader><DialogTitle>Công thức: {item.name}</DialogTitle></DialogHeader>
      <p className="text-xs text-muted-foreground">Lượng nguyên liệu dùng cho 1 phần. Khi bán, kho sẽ tự trừ theo công thức này.</p>
      <div className="max-h-80 space-y-2 overflow-y-auto">
        {stock.map((s) => (
          <label key={s.id} className="flex items-center gap-2 text-sm">
            <span className="flex-1">{s.name}</span>
            <input type="number" step="any" min={0} value={r[s.id] ?? ""} placeholder="0"
              onChange={(e) => setR({ ...r, [s.id]: e.target.value })} className="w-24 rounded border bg-background px-2 py-1" />
            <span className="w-10 text-muted-foreground">{s.unit}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-end">
        <button className={btn.primary} onClick={() => onSave(Object.fromEntries(Object.entries(r).map(([k, v]) => [k, Number(v)]).filter(([, v]) => Number(v) > 0)))}>Lưu công thức</button>
      </div>
    </>
  );
}
