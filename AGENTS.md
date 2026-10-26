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

- All site copy lives in src/lib/i18n.tsx (en + el dictionaries) — keeps both languages in sync in one place.
- Contact submissions are inserted server-side via a server function into contact_submissions (RLS on, no public policies) — visitors can never read submissions.
- AI project advisor: browser posts to server route /api/advisor, which streams plain text from the Lovable AI Gateway (Responses API); keeps the API key server-side and lets the page show text as it arrives.
- AI photo/plan review: /inspect page downscales images in the browser and posts base64 images/PDFs to server route /api/inspect, which streams text from the AI Gateway; files are never stored.
- The shared CircleCursor is a pointer-events-free client enhancement mounted in the root; enable it only for fine hover pointers without reduced motion so touch and keyboard interaction stay native.
