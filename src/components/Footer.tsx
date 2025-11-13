import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Profitiv
            </h3>
            <p className="text-sm text-muted-foreground">
              Transform your spare time into real income. Earn rewards from verified engagement tasks.
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/terms" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/payout-policy" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Payout Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/kyc-policy" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  KYC & Verification Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="mailto:profitiv001@gmail.com" 
                  className="hover:text-secondary transition-colors"
                >
                  profitiv001@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Profitiv LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
