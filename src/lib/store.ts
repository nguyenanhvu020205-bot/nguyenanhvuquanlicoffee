import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  consumption, makeSeedOrders, seedMenu, seedStaff, seedStock,
  type MenuItem, type Order, type OrderStatus, type Staff, type StockItem,
} from "./data";

type State = {
  user: string | null;
  menu: MenuItem[];
  staff: Staff[];
  stock: StockItem[];
  orders: Order[];
  login: (u: string, p: string) => boolean;
  logout: () => void;
  saveMenu: (m: Omit<MenuItem, "id"> & { id?: number | undefined }) => void;
  removeMenu: (id: number) => void;
  saveStaff: (s: Omit<Staff, "id"> & { id?: string | undefined }) => void;
  removeStaff: (id: string) => void;
  saveStock: (s: Omit<StockItem, "id"> & { id?: string | undefined }) => void;
  removeStock: (id: string) => void;
  restock: (id: string, amount: number) => void;
  createOrder: (o: { customer: string; phone: string; lines: { menuId: number; qty: number; price?: number | undefined; label?: string | undefined }[]; paid: boolean; staffId?: string | undefined }) => Order | null;
  setStatus: (id: string, s: OrderStatus) => void;
  setPaid: (id: string, paid: boolean) => void;
  removeOrder: (id: string) => void;
  resetData: () => void;
};

const nextId = (prefix: string, ids: string[]) => {
  const max = ids.reduce((m, id) => Math.max(m, parseInt(id.replace(/\D/g, "")) || 0), 0);
  return prefix + String(max + 1).padStart(2, "0");
};

const applyStock = (stock: StockItem[], need: Record<string, number>, sign: 1 | -1) =>
  stock.map((s) => { const n = need[s.id]; return n ? { ...s, qty: Math.max(0, +(s.qty + sign * n).toFixed(3)) } : s; });

export const ACCOUNTS: Record<string, string> = { admin: "123456", thungan: "123456" };

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      menu: seedMenu,
      staff: seedStaff,
      stock: seedStock,
      orders: makeSeedOrders(),
      login: (u, p) => {
        if (ACCOUNTS[u.trim()] !== p) return false;
        set({ user: u.trim() });
        return true;
      },
      logout: () => set({ user: null }),
      saveMenu: (m) =>
        set((s) => m.id
          ? { menu: s.menu.map((x) => (x.id === m.id ? { ...x, ...m, id: x.id } : x)) }
          : { menu: [...s.menu, { ...m, id: Math.max(0, ...s.menu.map((x) => x.id)) + 1 }] }),
      removeMenu: (id) => set((s) => ({ menu: s.menu.filter((x) => x.id !== id) })),
      saveStaff: (m) =>
        set((s) => m.id
          ? { staff: s.staff.map((x) => (x.id === m.id ? { ...x, ...m, id: x.id } : x)) }
          : { staff: [...s.staff, { ...m, id: nextId("NV", s.staff.map((x) => x.id)) }] }),
      removeStaff: (id) => set((s) => ({ staff: s.staff.filter((x) => x.id !== id) })),
      saveStock: (m) =>
        set((s) => m.id
          ? { stock: s.stock.map((x) => (x.id === m.id ? { ...x, ...m, id: x.id } : x)) }
          : { stock: [...s.stock, { ...m, id: nextId("K", s.stock.map((x) => x.id)) }] }),
      removeStock: (id) => set((s) => ({ stock: s.stock.filter((x) => x.id !== id) })),
      restock: (id, amount) => set((s) => ({ stock: applyStock(s.stock, { [id]: amount }, 1) })),
      createOrder: ({ customer, phone, lines, paid, staffId }) => {
        const { menu, orders, stock } = get();
        const items = lines.filter((l) => l.qty > 0).flatMap((l) => {
          const m = menu.find((x) => x.id === l.menuId);
          return m ? [{ menuId: m.id, name: m.name + (l.label ? ` (${l.label})` : ""), price: l.price ?? m.price, qty: l.qty }] : [];
        });
        if (!items.length) return null;
        const num = Math.max(1000, ...orders.map((o) => parseInt(o.id.slice(2)) || 0)) + 1;
        const order: Order = {
          id: "DH" + num,
          customer: customer.trim() || "Khách lẻ",
          phone: phone.trim(),
          createdAt: new Date().toISOString(),
          items,
          total: items.reduce((s, i) => s + i.price * i.qty, 0),
          status: "Đang pha",
          paid,
          staffId,
        };
        set({ orders: [order, ...orders], stock: applyStock(stock, consumption(menu, items), -1) });
        return order;
      },
      setStatus: (id, status) =>
        set((s) => {
          const o = s.orders.find((x) => x.id === id);
          if (!o || o.status === status) return {};
          let stock = s.stock;
          // Hủy đơn: hoàn nguyên liệu; khôi phục đơn hủy: trừ lại
          if (status === "Đã hủy") stock = applyStock(stock, consumption(s.menu, o.items), 1);
          else if (o.status === "Đã hủy") stock = applyStock(stock, consumption(s.menu, o.items), -1);
          return { stock, orders: s.orders.map((x) => (x.id === id ? { ...x, status } : x)) };
        }),
      setPaid: (id, paid) => set((s) => ({ orders: s.orders.map((x) => (x.id === id ? { ...x, paid } : x)) })),
      removeOrder: (id) => set((s) => ({ orders: s.orders.filter((x) => x.id !== id) })),
      resetData: () => set({ menu: seedMenu, staff: seedStaff, stock: seedStock, orders: makeSeedOrders() }),
    }),
    {
      name: "guinn-coffee-data",
      skipHydration: true,
      version: 5,
      // Bản 2: menu mới theo danh sách HIVER (Size M/L) — làm mới menu khi nâng cấp từ bản cũ
      migrate: (persisted, version) => {
        const p = persisted as State;
        if (version < 2) return { ...p, menu: seedMenu, stock: seedStock };
        if (version < 3) {
          // Bản 3: gắn ảnh món có sẵn + danh sách nguyên liệu mới
          const img = new Map(seedMenu.map((m) => [m.id, m.image]));
          return { ...p, stock: seedStock, menu: p.menu.map((m) => (m.image ? m : { ...m, image: img.get(m.id) ?? "" })) };
        }
        if (version < 4) {
          // Bản 4: công thức mới cho toàn bộ món theo danh sách nguyên liệu HIVER
          const rec = new Map(seedMenu.map((m) => [m.id, m.recipe]));
          return { ...p, menu: (p.menu ?? []).map((m) => ({ ...m, recipe: rec.get(m.id) ?? m.recipe ?? {} })) };
        }
        if (version < 5) {
          // Bản 5: ảnh món được tải lên lại với địa chỉ mới — sửa lại món nào đang trỏ tới ảnh cũ
          const ok = new Set(seedMenu.map((m) => m.image));
          const img = new Map(seedMenu.map((m) => [m.id, m.image]));
          return {
            ...p,
            menu: (p.menu ?? []).map((m) =>
              m.image?.startsWith("/__l5e/") && !ok.has(m.image) ? { ...m, image: img.get(m.id) ?? "" } : m,
            ),
          };
        }
        return p;
      },
    },
  ),
);

export const snapshot = () => {
  const { menu, stock, orders, staff } = useStore.getState();
  return { menu, stock, orders, staff };
};
