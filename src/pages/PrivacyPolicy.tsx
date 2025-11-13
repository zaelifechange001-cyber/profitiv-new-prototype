import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Profitiv — Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              <strong>Effective Date:</strong> November 13, 2025
            </p>
            <p className="text-muted-foreground mb-8">
              <strong>Contact:</strong> profitiv001@gmail.com
            </p>

            <div className="space-y-6 text-foreground/90">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Privacy Policy — Summary</h2>
                <p className="mb-4">
                  Profitiv collects personal data necessary to provide the service, including name, email, 
                  billing information, identity verification documents for KYC, campaign interaction data, 
                  and support communications.
                </p>

                <ul className="space-y-4 list-none">
                  <li className="pl-4 border-l-2 border-secondary/50">
                    <strong className="text-foreground">Use of Data:</strong> To operate accounts, process payments, 
                    verify identity, detect fraud, personalize experiences, and comply with legal obligations.
                  </li>
                  <li className="pl-4 border-l-2 border-secondary/50">
                    <strong className="text-foreground">Sharing:</strong> We share limited data only with trusted 
                    providers: payment processors (Stripe), identity verification partners, and hosting/analytics 
                    providers. We do not sell personal data.
                  </li>
                  <li className="pl-4 border-l-2 border-secondary/50">
                    <strong className="text-foreground">Data Retention:</strong> Data is retained as necessary; 
                    users may request deletion via profitiv001@gmail.com.
                  </li>
                  <li className="pl-4 border-l-2 border-secondary/50">
                    <strong className="text-foreground">Security:</strong> We use encryption and standard security 
                    practices; no system is 100% secure.
                  </li>
                  <li className="pl-4 border-l-2 border-secondary/50">
                    <strong className="text-foreground">Cookies & Tracking:</strong> Cookies/analytics are used to 
                    improve the product; disabling cookies may limit features.
                  </li>
                  <li className="pl-4 border-l-2 border-secondary/50">
                    <strong className="text-foreground">Children:</strong> Profitiv is for users 18+; we do not 
                    knowingly collect data from minors.
                  </li>
                </ul>

                <p className="mt-6 text-sm text-muted-foreground">
                  For the full legal versions or to request changes, email{" "}
                  <a href="mailto:profitiv001@gmail.com" className="text-secondary hover:underline">
                    profitiv001@gmail.com
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
