export type PlanId = 'free' | 'premium' | 'business';
export interface SubscriptionPlan { id: PlanId; name: string; price: string; features: string[]; }
export interface PaymentService { listPlans(): Promise<SubscriptionPlan[]>; createCheckoutSession(plan: PlanId): Promise<{ mode: 'mock'; message: string }>; }

export const mockPaymentService: PaymentService = {
  async listPlans() {
    return [
      { id: 'free', name: 'Free', price: '$0', features: ['Basic scans', 'Basic profiles', 'Limited saves'] },
      { id: 'premium', name: 'Premium', price: '$8.99/mo', features: ['Unlimited scans', 'Advanced timelines', 'AI reconstructions', 'Collections'] },
      { id: 'business', name: 'Business', price: 'Custom', features: ['Property reports', 'API access', 'Team workflows'] }
    ];
  },
  async createCheckoutSession(plan) { return { mode: 'mock', message: `Stripe checkout is not live. Configure server-side billing for ${plan}.` }; }
};
