import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function KYCPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Identity & Verification Policy
            </h1>

            <div className="space-y-6 text-foreground/90">
              <p>
                To comply with U.S. financial laws and ensure a secure platform, Profitiv requires every user 
                to complete KYC verification before withdrawals or financial activity.
              </p>

              <ul className="space-y-4 list-none">
                <li className="pl-4 border-l-2 border-secondary/50">
                  Users must provide a <strong>valid government-issued ID</strong> and{" "}
                  <strong>proof of address</strong> (such as a utility bill or bank statement).
                </li>
                <li className="pl-4 border-l-2 border-secondary/50">
                  Email and phone verification are required for all accounts.
                </li>
                <li className="pl-4 border-l-2 border-secondary/50">
                  KYC information is securely processed through our payment partner{" "}
                  <strong>Stripe Identity</strong> and stored according to privacy laws.
                </li>
                <li className="pl-4 border-l-2 border-secondary/50">
                  Profitiv never sells or shares personal verification data with third parties outside of legal 
                  or payment compliance.
                </li>
                <li className="pl-4 border-l-2 border-secondary/50">
                  Accounts failing to complete or pass verification may be suspended until compliance is met.
                </li>
              </ul>

              <p className="text-sm text-muted-foreground mt-6">
                Verification ensures that Profitiv remains safe, compliant, and fair for all users and creators.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
