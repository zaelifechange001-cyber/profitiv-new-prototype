import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function PayoutPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Payout Policy
            </h1>

            <div className="space-y-6 text-foreground/90">
              <p>
                Profitiv processes all withdrawals securely through <strong>Stripe</strong>. 
                To protect both users and brands, payouts follow the terms below:
              </p>

              <ul className="space-y-4 list-none">
                <li className="pl-4 border-l-2 border-primary/50">
                  All users must complete full <strong>KYC verification</strong> (government ID, address, 
                  and email/phone) before any withdrawal is released.
                </li>
                <li className="pl-4 border-l-2 border-primary/50">
                  Payout requests are reviewed and processed within <strong>1-5 business days</strong> after 
                  verification.
                </li>
                <li className="pl-4 border-l-2 border-primary/50">
                  Withdrawal limits are based on the user's <strong>subscription plan</strong> and may reset 
                  weekly or monthly as stated in the plan details.
                </li>
                <li className="pl-4 border-l-2 border-primary/50">
                  Profitiv reserves the right to delay or review a payout if suspicious or irregular activity 
                  is detected.
                </li>
                <li className="pl-4 border-l-2 border-primary/50">
                  All payments are made in <strong>USD</strong> directly to the verified Stripe account linked 
                  to the user profile.
                </li>
              </ul>

              <p className="text-sm text-muted-foreground mt-6">
                By requesting a withdrawal, you confirm that you are the verified account holder and that your 
                activity complies with Profitiv's Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
