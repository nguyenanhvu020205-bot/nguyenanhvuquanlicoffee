import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { useStoreReady, inputCls } from "@/components/AppShell";
import coffeeImg from "@/assets/login-coffee.jpg";
const logo = { url: "/hiver-logo.png" };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Đăng nhập – HIVER" },
      { name: "description", content: "Phần mềm quản lý quán cà phê HIVER." },
      { property: "og:title", content: "Đăng nhập – HIVER" },
      { property: "og:description", content: "Phần mềm quản lý quán cà phê HIVER." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const ready = useStoreReady();
  const user = useStore((s) => s.user);
  const login = useStore((s) => s.login);
  const [u, setU] = useState("admin");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { if (ready && user) nav({ to: "/dashboard" }); }, [ready, user, nav]);

  return (
    <div className="bg-nav flex min-h-screen items-center justify-center p-4 sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-card shadow-2xl md:grid-cols-[1.05fr_1fr]">
        <div className="relative hidden min-h-[560px] md:block">
          <img src={coffeeImg} alt="Tách cà phê HIVER" width={896} height={1152} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-10 text-primary-foreground">
            <p className="font-display text-2xl italic leading-snug">“Một tách cà phê ngon khởi đầu cho một ngày tuyệt vời!”</p>
            <p className="mt-3 text-xs uppercase tracking-[0.3em] opacity-80">Good coffee · Good day</p>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (login(u, p)) nav({ to: "/dashboard" });
            else setErr("Sai tên đăng nhập hoặc mật khẩu.");
          }}
          className="flex flex-col justify-center px-8 py-10 sm:px-12"
        >
          <div className="mb-8 flex flex-col items-center text-center">
            <img src={logo.url} alt="Logo HIVER Coffee" width={112} height={112} className="h-28 w-28 rounded-full shadow-card" />
            <h1 className="mt-5 font-display text-2xl font-bold text-primary">Đăng nhập</h1>
            <p className="mt-1 text-sm text-muted-foreground">Chào mừng bạn quay trở lại!</p>
          </div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tài khoản</label>
          <input value={u} onChange={(e) => setU(e.target.value)} className={`mb-4 mt-1.5 ${inputCls}`} />
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mật khẩu</label>
          <input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="••••••" className={`mt-1.5 ${inputCls}`} />
          {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
          <button className="mt-6 w-full rounded-md bg-primary py-3 font-semibold tracking-wide text-primary-foreground shadow-card transition hover:opacity-90">
            Đăng nhập
          </button>
          <p className="mt-6 text-center text-xs text-muted-foreground">Tài khoản thử: admin / 123456 · thungan / 123456</p>
        </form>
      </div>
    </div>
  );
}
