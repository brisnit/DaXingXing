// Stripe configuration + product catalog mapping (architecture only at MVP).
// Prices are editable by admins in the real system and are NOT hard-coded into
// business logic — this map is the seam where Stripe Price IDs get wired in.

export interface BillingPlan {
  key: string;
  name: string;
  stripePriceEnv: string; // env var holding the Stripe Price ID
  mode: "subscription" | "payment";
}

export const billingPlans: BillingPlan[] = [
  { key: "builder", name: "Builder", stripePriceEnv: "STRIPE_PRICE_BUILDER", mode: "subscription" },
  { key: "company", name: "Company", stripePriceEnv: "STRIPE_PRICE_COMPANY", mode: "subscription" },
  { key: "prototype", name: "Prototype Package", stripePriceEnv: "STRIPE_PRICE_PROTOTYPE", mode: "payment" },
];

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
