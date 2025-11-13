import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Profitiv — Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">
              <strong>Effective Date:</strong> November 13, 2025
            </p>
            <p className="text-muted-foreground mb-8">
              <strong>Legal Entity:</strong> Profitiv LLC (publicly branded as "Profitiv")
            </p>
            <p className="text-muted-foreground mb-8">
              <strong>Contact:</strong> profitiv001@gmail.com
            </p>

            <div className="space-y-6 text-foreground/90">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Terms of Service — Summary</h2>
                <p className="mb-4">
                  Welcome to Profitiv. By using our platform you agree to these Terms and our Privacy Policy. 
                  Profitiv operates a two-sided platform connecting Creators/Brands and Earners via 
                  subscription-based services, campaigns, and the TIV Marketplace.
                </p>

                <ul className="space-y-4 list-none">
                  <li className="pl-4 border-l-2 border-primary/50">
                    <strong className="text-foreground">Roles:</strong> Creators/Brands create and fund campaigns. 
                    Earners engage with campaigns to earn rewards (TIVs).
                  </li>
                  <li className="pl-4 border-l-2 border-primary/50">
                    <strong className="text-foreground">Subscriptions:</strong> Access and feature limits depend on 
                    your subscription plan. Subscriptions bill via Stripe and auto-renew unless cancelled.
                  </li>
                  <li className="pl-4 border-l-2 border-primary/50">
                    <strong className="text-foreground">Payments & Rewards:</strong> All transactions are securely 
                    processed by Stripe. Earners receive rewards (promotional payouts), not wages or investment returns. 
                    Verification (KYC) is required before withdrawals.
                  </li>
                  <li className="pl-4 border-l-2 border-primary/50">
                    <strong className="text-foreground">TIV Marketplace:</strong> Creators may purchase TIV packs 
                    for campaign perks; Earners primarily earn TIVs through participation. Marketplace activity may 
                    involve fees.
                  </li>
                  <li className="pl-4 border-l-2 border-primary/50">
                    <strong className="text-foreground">Prohibited Conduct:</strong> No fraudulent activity, 
                    manipulation of campaigns, multiple accounts to bypass limits, or illegal content.
                  </li>
                  <li className="pl-4 border-l-2 border-primary/50">
                    <strong className="text-foreground">Account Termination:</strong> Profitiv may suspend or 
                    terminate accounts for violations, with potential forfeiture of balances in cases of proven fraud.
                  </li>
                  <li className="pl-4 border-l-2 border-primary/50">
                    <strong className="text-foreground">Limitation of Liability:</strong> Services are provided 
                    "as-is". Profitiv is not liable for lost earnings, data, or third-party services.
                  </li>
                  <li className="pl-4 border-l-2 border-primary/50">
                    <strong className="text-foreground">Governing Law:</strong> These Terms are governed by Ohio 
                    law and disputes are resolved in Hamilton County, Ohio.
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
