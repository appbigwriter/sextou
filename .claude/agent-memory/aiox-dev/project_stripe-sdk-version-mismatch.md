---
name: stripe-sdk-version-mismatch
description: Stripe SDK is v22 but apiVersion pinned to 2024-12-18.acacia — several object fields moved; affects any Stripe webhook/subscription code
metadata:
  type: project
---

The installed `stripe` package is **v22.0.0** while `lib/stripe.ts` pins `apiVersion: "2024-12-18.acacia"` (older). The SDK TypeScript types follow v22, so several fields moved location vs older docs/snippets:

- `current_period_end` is now on the **subscription item** (`subscription.items.data[0].current_period_end`), NOT on the Subscription object.
- The invoice→subscription link is `invoice.parent.subscription_details.subscription` (string | Subscription). The old `invoice.subscription` field was **removed**.
- Stripe type definitions live at `node_modules/stripe/cjs/resources/*.d.ts` (not a `types/` dir).

**Why:** discovered while implementing Launch Studio PRO story 1.7 (premium subscription checkout + webhook). Code using the old field paths fails `tsc --noEmit`.

**How to apply:** when writing/reviewing Stripe code (webhooks, subscriptions, invoices) in this repo, use the v22 field paths above, or grep the `.d.ts` files to confirm the current shape before accessing nested fields. Related: gate logic in `lib/sextou-tools/auth.ts` (`resolveSextouToolsProUser`) already releases access via OR on `isPremium`.
