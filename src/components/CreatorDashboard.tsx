import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface CreatorDashboardProps {
  userId: string;
}

interface UserProfile {
  available_balance: number;
  tiv_balance: number;
  total_earned: number;
}

interface Campaign {
  id: string;
  title: string;
  video_length: string;
  remaining_views: number;
  status: 'Active' | 'Completed' | 'Paused';
}

const CreatorDashboard = ({ userId }: CreatorDashboardProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [campaigns] = useState<Campaign[]>([
    { id: '1', title: 'Product Showcase - Fall Line', video_length: '30s', remaining_views: 3000, status: 'Active' },
    { id: '2', title: 'YouTube Ad Campaign', video_length: '45s', remaining_views: 1200, status: 'Completed' },
  ]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const totalViews = 58432;
  const tivBalance = profile?.tiv_balance || 3680;
  const tivToUSD = 0.10;
  const earningsUSD = (tivBalance * tivToUSD).toFixed(2);
  const availableBalance = profile?.available_balance || 1850;
  const pendingBalance = 420;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: API Integration - Fetch user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('available_balance, tiv_balance, total_earned')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, toast]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
      navigate("/");
    }
  };

  const handleCreateCampaign = () => {
    toast({
      title: "Coming Soon",
      description: "Campaign creation will be available soon. Backend integration required.",
    });
  };

  if (loading) {
    return (
    <div id="profitiv-app" data-theme="custom" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #6B46C1 0%, #7C3AED 25%, #4F46E5 50%, #0EA5E9 75%, #06B6D4 100%)' 
    }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', border: '4px solid #a259ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="profitiv-app" data-theme="custom" style={{ 
      background: 'linear-gradient(135deg, #6B46C1 0%, #7C3AED 25%, #4F46E5 50%, #0EA5E9 75%, #06B6D4 100%)', 
      color: '#fff', 
      minHeight: '100vh', 
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }} data-role="creator">
      <style>{`
        #profitiv-app, #profitiv-app * {
          box-sizing: border-box;
        }
        
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(162,89,255,0.5); }
          50% { box-shadow: 0 0 25px rgba(162,89,255,0.7); }
          100% { box-shadow: 0 0 10px rgba(162,89,255,0.5); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ 
            color: '#00D9FF', 
            fontWeight: 800, 
            letterSpacing: '1.5px', 
            margin: 0, 
            fontSize: '32px',
            textShadow: '0 0 30px rgba(0,217,255,0.8), 0 0 60px rgba(0,217,255,0.4)',
            fontFamily: 'Inter, sans-serif'
          }}>
            Profitiv
          </h2>
          <div style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 600, marginTop: '6px' }}>Welcome back</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: '2px' }}>Creator Dashboard</div>
        </div>
        <nav style={{ display: 'flex', gap: '30px' }}>
          <a href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Home</a>
          <a href="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Dashboard</a>
          <a href="/videos" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Campaigns</a>
          <a href="/marketplace" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Wallet</a>
        </nav>
      </header>

      {/* Stats Section */}
      <section style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '40px', gap: '20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(0,191,255,0.2) 100%)',
          borderRadius: '20px',
          padding: '30px',
          minWidth: '220px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: '#E9F0FF', fontSize: '14px', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Active Campaigns</h3>
          <p style={{ fontSize: '36px', fontWeight: 800, margin: 0, color: '#fff' }}>{activeCampaigns}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(0,191,255,0.2) 100%)',
          borderRadius: '20px',
          padding: '30px',
          minWidth: '220px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: '#E9F0FF', fontSize: '14px', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Total Views</h3>
          <p style={{ fontSize: '36px', fontWeight: 800, margin: 0, color: '#fff' }}>{totalViews.toLocaleString()}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(0,191,255,0.2) 100%)',
          borderRadius: '20px',
          padding: '30px',
          minWidth: '220px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: '#E9F0FF', fontSize: '14px', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Earnings</h3>
          <p style={{ fontSize: '36px', fontWeight: 800, margin: 0, color: '#fff' }}>{tivBalance.toLocaleString()} TIVs (≈ ${earningsUSD})</p>
        </div>
      </section>

      {/* Create New Campaign */}
      <section style={{ padding: '40px', textAlign: 'center' }}>
        <button 
          onClick={handleCreateCampaign}
          style={{
            background: 'linear-gradient(90deg, #7f00ff, #e100ff)',
            border: 'none',
            padding: '15px 40px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            color: '#fff',
            animation: 'pulseGlow 3s infinite ease-in-out',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={20} />
          Create New Campaign
        </button>
      </section>

      {/* Active Campaigns Table */}
      <section style={{ padding: '40px' }}>
        <h2 style={{ color: '#fff', marginBottom: '20px' }}>Your Campaigns</h2>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#17171c',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <thead style={{ background: '#1f1f24' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>Campaign Title</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Video Length</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Remaining Views</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px' }}>{campaign.title}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>{campaign.video_length}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>{campaign.remaining_views.toLocaleString()}</td>
                <td style={{ 
                  padding: '15px', 
                  color: campaign.status === 'Active' ? '#a259ff' : '#888', 
                  textAlign: 'center' 
                }}>
                  {campaign.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Wallet Summary */}
      <section style={{
        padding: '40px',
        background: '#141418',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#a259ff', fontSize: '14px', margin: '0 0 10px 0' }}>Available Balance</h3>
          <p style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>{availableBalance.toLocaleString()} TIVs (≈ ${(availableBalance * tivToUSD).toFixed(0)})</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#a259ff', fontSize: '14px', margin: '0 0 10px 0' }}>Pending</h3>
          <p style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>{pendingBalance.toLocaleString()} TIVs (≈ ${(pendingBalance * tivToUSD).toFixed(0)})</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/payout-settings')}
            style={{
              background: 'linear-gradient(90deg, #7f00ff, #e100ff)',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '6px',
              fontSize: '16px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              animation: 'pulseGlow 3s infinite ease-in-out'
            }}
          >
            Withdraw via Stripe
          </button>
        </div>
      </section>

      {/* Legal Notice */}
      <div style={{ padding: '20px 40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          <strong>Legal:</strong> Profitiv is a fintech marketing & promotional rewards platform. 
          Rewards shown are from verified engagement activity — not an investment service. 
          Payouts and transactions require Stripe integration and verification.
        </p>
      </div>
    </div>
  );
};

export default CreatorDashboard;
