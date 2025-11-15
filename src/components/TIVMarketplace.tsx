import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TIVMarketplaceProps {
  role: "earner" | "creator";
}

const TIVMarketplace = ({ role }: TIVMarketplaceProps) => {
  const isCreator = role === "creator";

  const creatorListings = [
    { title: "Starter Pack", amount: "500 TIV", price: "$20", description: "Use for small perks and course unlocks" },
    { title: "Creator Pack", amount: "10,000 TIV", price: "$350", description: "For higher-value perks and conversion rewards" },
    { title: "Mega Pack", amount: "70,000 TIV", price: "$2,900", description: "Scale campaigns and premium perks" },
  ];

  const earnerListings = [
    { title: "Sell 500 TIV", amount: "500 TIV", price: "$18", description: "Instant payout" },
    { title: "Buy 2,500 TIV", amount: "2,500 TIV", price: "$90", description: "Use to unlock creator perks or boost earnings" },
    { title: "Special Offer", amount: "Discount pack", price: "Limited time", description: "Limited-time promotions from creators" },
  ];

  const listings = isCreator ? creatorListings : earnerListings;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-background/50 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${isCreator ? 'from-profitiv-purple/5' : 'from-profitiv-teal/5'} via-transparent to-transparent pointer-events-none`} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            The <span className="text-gradient-hero">Inside the TIV</span> Marketplace
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            {isCreator 
              ? "Buy TIV packs to fund perks or purchase special TIV grants for conversion tasks."
              : "See TIV listings, sell or buy packs, and use TIVs to unlock perks. Marketplace trades are immediate and visible to all users."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {listings.map((listing, index) => (
            <Card key={index} className="glass-card p-6 hover-lift flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{listing.title}</h3>
                <div className="text-3xl font-bold text-gradient-hero mb-3">{listing.price}</div>
                <p className="text-sm text-muted-foreground mb-4">{listing.amount} • {listing.description}</p>
              </div>
              <Button variant={isCreator ? "default" : "gradient"} className="w-full">
                {isCreator ? "Buy Pack" : listing.title.startsWith("Sell") ? "Sell" : listing.title.startsWith("Buy") ? "Buy" : "View"}
              </Button>
            </Card>
          ))}
        </div>

        <Card className="glass-card p-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Listing</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-sm">500 TIV — Instant</td>
                  <td className="py-3 px-4 text-sm">{isCreator ? "Buy" : "Sell"}</td>
                  <td className="py-3 px-4 text-sm font-semibold">{isCreator ? "$20" : "$18"}</td>
                  <td className="py-3 px-4"><Button variant="outline" size="sm">{isCreator ? "Buy" : "Sell"}</Button></td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 text-sm">2,500 TIV — Instant</td>
                  <td className="py-3 px-4 text-sm">Buy</td>
                  <td className="py-3 px-4 text-sm font-semibold">$90</td>
                  <td className="py-3 px-4"><Button variant="outline" size="sm">Buy</Button></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm">{isCreator ? "Creator Reserved Pack" : "Promo Pack"}</td>
                  <td className="py-3 px-4 text-sm">{isCreator ? "Private" : "Buy"}</td>
                  <td className="py-3 px-4 text-sm font-semibold">$350</td>
                  <td className="py-3 px-4"><Button variant="outline" size="sm">{isCreator ? "Request" : "Buy"}</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <div className="glass-card p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">
            How {isCreator ? "creators" : "earners"} typically use the marketplace:
          </strong>{" "}
          {isCreator 
            ? "Buy TIV packs to add conversion incentives, reward loyal fans, or to add higher-value perks to a campaign. Use responsibly — Profitiv monitors listings to prevent abuse."
            : "Sell earned TIVs for cash, buy TIVs to access premium tasks or perks, or hold them to participate in higher-reward campaigns."}
        </div>
      </div>
    </section>
  );
};

export default TIVMarketplace;
