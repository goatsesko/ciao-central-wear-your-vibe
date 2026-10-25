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

## Architecture rules
- All catalog reads go through `src/lib/catalog/index.ts` async functions + queryOptions; UI never imports sample data directly, so the source can be swapped for the database.
- Store settings (delivery fee/threshold, social URLs) live in `src/lib/format.ts` `STORE`; social URLs stay empty until the owner supplies them — never invent links.
- Cart state lives in `src/lib/cart.tsx` (React context + localStorage); prices are integer KSh.
- Shared chrome (announcement, header, footer, bag drawer) is rendered in `__root.tsx`; site components live in `src/components/site/`.
- Product short-film media is configured in `src/lib/product-films.ts`; the homepage carousel uses posters until owner-supplied video URLs exist, so previews never imply playable clips.
- Complete outfit sets use a single catalog product with `includedItems` and footwear-sized variants; the cart stores the entire set as one line so all included pieces stay together.
