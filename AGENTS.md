<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Shop data (menu, staff, stock, orders, login) lives in one browser-persisted store `src/lib/store.ts`; all pages read/write it so sales, stock, orders and stats stay linked. AI features receive a live data snapshot from the client because the server has no database.
