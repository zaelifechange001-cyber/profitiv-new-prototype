import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketplaceListing } from "@/types/dashboard";

interface TIVMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'creator' | 'earner';
}

const TIVMarketplaceModal = ({ isOpen, onClose, userRole }: TIVMarketplaceModalProps) => {
  // Mock marketplace listings - in production, fetch from backend
  const mockListings: MarketplaceListing[] = [
    { id: '1', seller: 'Earner_001', tiv: 500, price: 18, status: 'available' },
    { id: '2', seller: 'Earner_002', tiv: 2500, price: 90, status: 'available' },
  ];

  const handleBuyTiv = (listingId: string) => {
    // TODO: In production, call backend API
    // POST /api/market/buy { listingId }
    // Server should:
    // 1. Charge buyer (creator) via Stripe PaymentIntent
    // 2. Credit seller balance
    // 3. Mark listing as sold
    console.log('Buy TIV listing:', listingId);
    alert('Buy TIV feature requires backend integration. See TODO comments in code.');
  };

  const handleCancelSell = (listingId: string) => {
    // TODO: In production, call backend API
    // DELETE /api/market/orders/:listingId
    // Server should release reserved TIVs back to user balance
    console.log('Cancel listing:', listingId);
    alert('Cancel listing requires backend integration.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>TIV Marketplace</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Buy Listings */}
          <Card className="p-6">
            <h3 className="font-semibold mb-2 text-profitiv-purple">Buy Listings (Creators)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Creators can purchase TIV packs posted by earners.
            </p>
            
            <div className="space-y-3">
              {mockListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-semibold">{listing.seller}</p>
                    <p className="text-sm text-muted-foreground">{listing.tiv} TIV • ${listing.price}</p>
                  </div>
                  {listing.status === 'available' && userRole === 'creator' ? (
                    <Button size="sm" onClick={() => handleBuyTiv(listing.id)}>
                      Buy
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {listing.status === 'sold' ? 'Sold' : 'View Only'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Sell Listings / Your Orders */}
          <Card className="p-6">
            <h3 className="font-semibold mb-2 text-profitiv-teal">Your Listings / Public Sell Orders</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {userRole === 'earner' 
                ? 'Manage your sell orders. Cancel anytime before purchase.'
                : 'View active sell orders from earners.'}
            </p>
            
            <div className="space-y-3">
              {mockListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-semibold">{listing.seller}</p>
                    <p className="text-sm text-muted-foreground">{listing.tiv} TIV • ${listing.price}</p>
                  </div>
                  {listing.status === 'available' && userRole === 'earner' ? (
                    <Button variant="ghost" size="sm" onClick={() => handleCancelSell(listing.id)}>
                      Cancel
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {listing.status === 'sold' ? 'Sold' : 'Active'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TIVMarketplaceModal;
