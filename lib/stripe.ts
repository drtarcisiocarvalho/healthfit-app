// Stripe configuration - publishable key loaded from environment variable
// Set EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env file
export const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
}

/**
 * Simulates creating a payment intent on the server side.
 * In production, this should call your backend API which creates
 * a PaymentIntent using the Stripe secret key.
 */
export async function createPaymentIntent(amount: number): Promise<{
  clientSecret: string;
  paymentIntentId: string;
}> {
  // TODO: Replace with actual backend API call
  // Example: const response = await fetch(`${API_URL}/create-payment-intent`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ amount: Math.round(amount * 100), currency: "brl" }),
  // });
  // return response.json();

  // Simulated response for development
  const paymentIntentId = `pi_${Date.now()}`;
  return {
    clientSecret: `${paymentIntentId}_secret_simulated`,
    paymentIntentId,
  };
}

/**
 * Process a simulated payment for development.
 * In production, use Stripe's confirmPayment from @stripe/stripe-react-native.
 */
export async function processPayment(amount: number, productName: string): Promise<PaymentIntent> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const intent: PaymentIntent = {
    id: `pi_${Date.now()}`,
    amount: Math.round(amount * 100),
    currency: "brl",
    status: "succeeded",
  };

  return intent;
}
