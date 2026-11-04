import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Table, btn } from "@/components/AppShell";
import { FormDialog } from "@/components/FormDialog";
import { ROLES, SHIFTS, revenueOf, vnd, type Staff } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/nhan-vien")({
  head: () => ({ meta: [{ title: "Nhân viên – HIVER" }, { name: "description", content: "Quản lý nhân viên và ca trực." }, { property: "og:title", content: "Nhân viên – HIVER" }, { property: "og:description", content: "Quản lý nhân viên và ca trực." }] }),
  component: NhanVien,
});

function NhanVien() {
  const [edit, setEdit] = useState<Partial<Staff> | null>(null);
  return (
    <AppShell title="Nhân viên & ca trực" actions={<button className={btn.accent} onClick={() => setEdit({})}>+ Thêm nhân viên</button>}>
      <Body edit={edit} setEdit={setEdit} />
    </AppShell>
  );
}

function Body({ edit, setEdit }: { edit: Partial<Staff> | null; setEdit: (v: Partial<Staff> | null) => void }) {
  const { staff, orders, saveStaff, removeStaff } = useStore();
  const [shift, setShift] = useState("Tất cả");
  const list = staff.filter((s) => shift === "Tất cả" || s.shift === shift);
  return (
    <>
      <div className="mb-3 flex gap-2">
        {["Tất cả", ...SHIFTS].map((s) => <button key={s} onClick={() => setShift(s)} className={s === shift ? btn.primary : btn.ghost}>{s === "Tất cả" ? s : "Ca " + s}</button>)}
      </div>
      <Table head={["Mã NV", "Họ tên", "Chức vụ", "SĐT", "Ca trực", "Đơn phục vụ", "Doanh thu", ""]}
        rows={list.map((s) => {
          const mine = orders.filter((o) => o.staffId === s.id);
          return [s.id, <b>{s.name}</b>, s.role, s.phone, s.shift, mine.length, vnd(revenueOf(mine)),
            <span className="flex gap-3">
              <button className={btn.link} onClick={() => setEdit(s)}>Sửa</button>
              <button className={btn.linkDanger} onClick={() => confirm(`Xóa nhân viên "${s.name}"?`) && removeStaff(s.id)}>Xóa</button>
            </span>];
        })} />
      <FormDialog
        open={!!edit} onOpenChange={(v) => !v && setEdit(null)}
        title={edit?.id ? "Sửa nhân viên" : "Thêm nhân viên"}
        initial={{ name: edit?.name ?? "", role: edit?.role ?? ROLES[1], phone: edit?.phone ?? "", shift: edit?.shift ?? SHIFTS[0] }}
        fields={[
          { key: "name", label: "Họ tên", required: true },
          { key: "role", label: "Chức vụ", type: "select", options: ROLES },
          { key: "phone", label: "Số điện thoại", required: true },
          { key: "shift", label: "Ca trực", type: "select", options: SHIFTS },
        ]}
        onSubmit={(v) => {
          if (!/^0\d{9}$/.test(String(v.phone))) return "Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0.";
          saveStaff({ id: edit?.id, name: String(v.name), role: String(v.role), phone: String(v.phone), shift: String(v.shift) });
          return undefined;
        }}
      />
    </>
  );
}
