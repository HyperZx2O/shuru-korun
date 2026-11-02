# Shuru Korun (শুরু করুন)

A free, mobile-first web app that tells a first-time founder in Bangladesh exactly what to do, in what order, to start a small business. Built for the Ostad Presents YUNet AIgnite Buildathon 2026.

## Develop

```bash
pnpm install
cp .env.example .env.local   # set MOCK_AI=1 to run without API keys
pnpm dev
```

## Test

```bash
pnpm test   # vitest (rules engine + data invariants)
pnpm build  # production build
```

## Deploy

Push to `main`; Vercel builds a production deployment. Set `GROQ_API_KEY`, `GEMINI_API_KEY`, `GROQ_MODEL`, `GEMINI_MODEL` in Vercel project settings. Keep `MOCK_AI` unset in production once keys are present.

## Notes

- All facts come from `lib/rules/*` with a status of `verified`, `dated`, or `confirm`. The AI never invents facts.
- The official "Built For Ostad" sticker file is pending from the organizers; a labelled placeholder is shown in the navbar.