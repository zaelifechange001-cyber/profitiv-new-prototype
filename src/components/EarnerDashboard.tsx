import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EarnerDashboardProps {
  userId: string;
}

interface UserProfile {
  available_balance: number;
  tiv_balance: number;
  total_earned: number;
  tiv_to_usd_rate: number;
  subscription_plan: 'Starter' | 'Builder' | 'Pro' | 'Elite';
  weekly_withdraw_used: number;
  monthly_earned: number;
}

interface Campaign {
  id: string;
  title: string;
  creator: string;
  avatar: string;
  category: string;
  length: string;
  reward: number;
  viewsSoFar: number;
  targetViews: number;
  joined: boolean;
  status: string;
  videoUrl?: string;
}

interface Reward {
  date: string;
  campaign: string;
  reward: string;
  status: string;
}

type ViewType = 'dashboard' | 'campaigns' | 'marketplace' | 'withdraw' | 'profile';

const PLAN_LIMITS = {
  'Starter': { weekly: 125, monthly: 600 },
  'Builder': { weekly: 250, monthly: 1000 },
  'Pro': { weekly: 400, monthly: 1750 },
  'Elite': { weekly: 450, monthly: 2250 }
};

const EarnerDashboard = ({ userId }: EarnerDashboardProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [verificationData, setVerificationData] = useState({ name: '', address: '', phone: '' });
  const navigate = useNavigate();
  const { toast } = useToast();

  // TODO: API Integration - Replace with real data from backend
  const [campaigns] = useState<Campaign[]>([
    { id: 'c1', title: 'GlowDrop Ad', creator: 'GlowDrop', avatar: 'G', category: 'ad', length: '30s', reward: 15, viewsSoFar: 3000, targetViews: 5000, joined: true, status: 'Active', videoUrl: 'https://www.example.com/video' },
    { id: 'c4', title: 'Skin Serum — Product Review', creator: 'MayaBrand', avatar: 'M', category: 'product', length: '60s', reward: 20, viewsSoFar: 450, targetViews: 2000, joined: true, status: 'Active', videoUrl: 'https://www.example.com/video' }
  ]);

  const [recentRewards] = useState<Reward[]>([
    { date: '2025-11-08', campaign: 'Learn: Finance 101', reward: '15 TIV', status: 'Credited' },
    { date: '2025-11-07', campaign: 'Brand Ad: EcoBottle', reward: '10 TIV', status: 'Credited' },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // TODO: API Integration - Fetch complete user profile with subscription details
        const { data, error } = await supabase
          .from('profiles')
          .select('available_balance, tiv_balance, total_earned, tiv_to_usd_rate')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        
        if (data) {
          // TODO: Add subscription_plan, weekly_withdraw_used, monthly_earned to profiles table
          setProfile({
            ...data,
            subscription_plan: 'Builder', // Demo value
            weekly_withdraw_used: 200, // Demo value
            monthly_earned: 650 // Demo value
          });
        }
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

  const planLimits = profile ? PLAN_LIMITS[profile.subscription_plan] : PLAN_LIMITS['Starter'];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  const handleVerification = () => {
    // TODO: API Integration - POST /api/verify with name, address, phone
    if (!verificationData.name || !verificationData.address || !verificationData.phone) {
      toast({
        title: "Incomplete",
        description: "Please complete all verification fields",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Verification Submitted",
      description: "Please wait for approval. This is a demo flow.",
    });
  };

  const handleWithdraw = () => {
    // TODO: API Integration - POST /api/withdraw { userId, amount } -> Stripe payout
    // Check KYC status and plan limits on backend
    toast({
      title: "Withdrawal Requested",
      description: "Demo mode: Connect Stripe for real payouts",
    });
  };

  const handleWatchVideo = (campaignId: string) => {
    // TODO: API Integration - Open secure video modal, track full watch, verify completion
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign?.videoUrl) {
      window.open(campaign.videoUrl, '_blank');
      toast({
        title: "Video Opened",
        description: "Demo: In production, this opens a secure modal with watch verification",
      });
    }
  };

  const participatingCampaigns = campaigns.filter(c => c.joined);

  if (loading) {
    return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #6B46C1 0%, #7C3AED 25%, #4F46E5 50%, #0EA5E9 75%, #06B6D4 100%)'
    }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const usdEquivalent = profile ? (profile.tiv_balance * profile.tiv_to_usd_rate).toFixed(2) : '0.00';

  return (
    <div id="profitiv-app" data-theme="custom" data-role="earner"
      style={{
        background: 'linear-gradient(135deg, #6B46C1 0%, #7C3AED 25%, #4F46E5 50%, #0EA5E9 75%, #06B6D4 100%)',
        color: '#fff',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <style>{`
        #profitiv-app, #profitiv-app * { box-sizing: border-box; }

        /* Animated background layer to match Creator and avoid inline override */
        #profitiv-app[data-role='earner'] { position: relative; }
        #profitiv-app[data-role='earner']::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #6B46C1 0%, #7C3AED 25%, #4F46E5 50%, #0EA5E9 75%, #06B6D4 100%);
          background-size: 400% 400%;
          animation: profitivPulse 16s ease infinite;
          z-index: 0;
          pointer-events: none;
        }
        #profitiv-app[data-role='earner'] > * { position: relative; z-index: 1; }

        @keyframes profitivPulse {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(162,89,255,0.5); }
          50% { box-shadow: 0 0 25px rgba(162,89,255,0.7); }
          100% { box-shadow: 0 0 10px rgba(162,89,255,0.5); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Neon glow accents aligned with Creator look */
        .pv-card {
          background: rgba(255,255,255,0.03);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(1,2,6,0.5);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(10px);
        }
        .pv-stat-card {
          background: linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(0,191,255,0.2) 100%);
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
        }
        .pv-card h4 { margin: 0 0 8px; color: #E9F0FF; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9; }
        .pv-card .big { font-size: 32px; font-weight: 800; margin-top: 8px; color: #FFFFFF; }
        .pv-stat-card .big { font-size: 36px; }

        .pv-btn-primary {
          padding: 12px 20px;
          border-radius: 12px;
          border: 0;
          cursor: pointer;
          font-weight: 700;
          background: #8b5cf6;
          color: #fff;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
        }
        .pv-btn-primary:hover {
          transform: translateY(-2px);
          background: #9b6df9;
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.75);
        }
        .pv-btn-ghost {
          padding: 12px 20px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          color: #E9F0FF;
          transition: all 0.2s;
        }
        .pv-btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }
        .pv-input { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #E9F0FF; }
        .bar { height: 12px; background: rgba(255,255,255,0.1); border-radius: 999px; overflow: hidden; }
        .bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #00bfff, #7c3aed); transition: width 0.6s ease; box-shadow: 0 0 10px rgba(0,191,255,0.45); }
        .muted { color: #B9C2E6; font-size: 13px; }
      `}</style>

      {/* Header - NO HOME LINK for signed-in earners */}
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
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: '2px' }}>Earner Dashboard</div>
        </div>
        <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Dashboard
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('campaigns'); }}
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Campaigns
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('marketplace'); }}
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Marketplace
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('withdraw'); }}
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Withdraw
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('profile'); }}
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 500
            }}
          >
            Profile
          </a>
          <button onClick={handleLogout} className="pv-btn-ghost">
            Logout
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* DASHBOARD VIEW */}
        {currentView === 'dashboard' && (
          <div>
            {/* Hero Section */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', margin: 0 }}>Your Earning</h1>
              <p style={{ fontSize: '16px', color: '#B9C2E6', marginTop: '8px' }}>Overview of your rewards, tasks, and active campaigns.</p>
            </div>

            {/* Top Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              <div className="pv-stat-card">
                <h4>Total Earned</h4>
                <div className="big">${profile?.total_earned.toLocaleString() || '0.00'}</div>
                <div className="muted">All-time earnings</div>
              </div>
              <div className="pv-stat-card">
                <h4>TIV Balance</h4>
                <div className="big">{profile?.tiv_balance.toLocaleString() || '0'}</div>
                <div className="muted">≈ ${usdEquivalent} USD</div>
              </div>
              <div className="pv-stat-card">
                <h4>Withdrawable</h4>
                <div className="big">${profile?.available_balance.toFixed(2) || '0.00'}</div>
                <div className="muted">Ready to withdraw</div>
              </div>
            </div>

            {/* Legal Notice */}
            <div style={{ 
              background: 'rgba(0,191,255,0.08)', 
              border: '1px solid rgba(0,191,255,0.2)', 
              borderRadius: '12px', 
              padding: '16px 20px', 
              marginBottom: '32px',
              fontSize: '13px',
              color: '#E9F0FF'
            }}>
              <strong>Legal:</strong> Profitiv is a fintech marketing & promotional rewards platform. Rewards are earned from verified engagement with brand campaigns — not an investment service. Withdrawals and TIV trades require backend payment integration and identity verification.
            </div>

            {/* Split Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '18px', alignItems: 'start' }}>
              
              {/* Left: Active Campaigns */}
              <div>
                <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Active Campaigns You're Participating In</h3>
                {participatingCampaigns.length === 0 ? (
                  <div className="pv-card">
                    <div className="muted">You are not currently participating in any campaigns. Use "Watch a Video" to join active campaigns.</div>
                  </div>
                ) : (
                  participatingCampaigns.map(campaign => {
                    const percent = Math.min(100, Math.round((campaign.viewsSoFar / campaign.targetViews) * 100));
                    return (
                      <div key={campaign.id} className="pv-card" style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '10px',
                              background: 'linear-gradient(135deg, #7c3aed, #00bfff)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              color: '#fff'
                            }}>
                              {campaign.avatar}
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, color: '#fff', fontSize: '16px' }}>{campaign.title}</div>
                              <div className="muted">{campaign.creator} · {campaign.category} · Length: {campaign.length}</div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="muted">Reward</div>
                            <div style={{ fontWeight: 800, color: '#fff' }}>{campaign.reward} TIV</div>
                          </div>
                        </div>
                        <div className="muted" style={{ marginBottom: '8px' }}>
                          {campaign.viewsSoFar.toLocaleString()} / {campaign.targetViews.toLocaleString()} views
                        </div>
                        <div className="bar">
                          <div className="bar-fill" style={{ width: `${percent}%` }} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                          <button className="pv-btn-ghost" onClick={() => toast({ title: "Creator Profile", description: `View ${campaign.creator}'s profile (demo)` })}>
                            View Creator
                          </button>
                          {campaign.videoUrl && (
                            <button className="pv-btn-primary" onClick={() => handleWatchVideo(campaign.id)}>
                              ▶ Watch & Earn
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Recent Rewards Table */}
                <div className="pv-card" style={{ marginTop: '24px' }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#fff' }}>Recent Rewards</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Date</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Campaign</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Reward</th>
                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '14px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRewards.map((reward, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '10px', fontSize: '14px' }}>{reward.date}</td>
                          <td style={{ padding: '10px', fontSize: '14px' }}>{reward.campaign}</td>
                          <td style={{ padding: '10px', fontSize: '14px' }}>{reward.reward}</td>
                          <td style={{ padding: '10px', fontSize: '14px', color: '#00bfff' }}>{reward.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Quick Actions */}
              <aside>
                <div className="pv-card" style={{ marginBottom: '12px' }}>
                  <h4 style={{ marginBottom: '12px' }}>Quick Actions</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>Watch a Video</div>
                        <div className="muted">Open campaigns to watch & earn</div>
                      </div>
                      <button className="pv-btn-primary" onClick={() => setCurrentView('campaigns')}>Go</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>TIV Marketplace</div>
                        <div className="muted">View-only (Earners cannot buy)</div>
                      </div>
                      <button className="pv-btn-ghost" onClick={() => setCurrentView('marketplace')}>Open</button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>Withdraw Rewards</div>
                        <div className="muted">Request payout or check limits</div>
                      </div>
                      <button className="pv-btn-primary" onClick={() => setCurrentView('withdraw')}>Withdraw</button>
                    </div>
                  </div>
                </div>

                {/* Plan Widget */}
                <div className="pv-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="muted">Plan</div>
                      <div style={{ fontWeight: 800, fontSize: '18px' }}>{profile?.subscription_plan || 'Starter'}</div>
                    </div>
                    <button className="pv-btn-ghost" onClick={() => setCurrentView('profile')}>Manage</button>
                  </div>
                  <div className="muted" style={{ marginTop: '8px' }}>
                    Monthly cap: ${planLimits.monthly}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* CAMPAIGNS VIEW */}
        {currentView === 'campaigns' && (
          <div>
            <div className="pv-card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#fff' }}>Campaigns</h3>
                  <div className="muted">Browse or re-open campaigns you participated in</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
              {campaigns.map(campaign => {
                const percent = Math.min(100, Math.round((campaign.viewsSoFar / campaign.targetViews) * 100));
                return (
                  <div key={campaign.id} className="pv-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #7c3aed, #00bfff)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          color: '#fff'
                        }}>
                          {campaign.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800 }}>{campaign.title}</div>
                          <div className="muted">{campaign.creator} • {campaign.category} • {campaign.length}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800 }}>{campaign.reward} TIV</div>
                        <div style={{ color: '#A6B0D6', fontSize: '13px' }}>{campaign.status}</div>
                      </div>
                    </div>
                    <div className="muted" style={{ marginBottom: '8px' }}>
                      {campaign.viewsSoFar.toLocaleString()} / {campaign.targetViews.toLocaleString()} views
                    </div>
                    <div className="bar">
                      <div className="bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                    {campaign.videoUrl && (
                      <button className="pv-btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={() => handleWatchVideo(campaign.id)}>
                        Watch & Earn
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MARKETPLACE VIEW - VIEW ONLY FOR EARNERS */}
        {currentView === 'marketplace' && (
          <div>
            <div className="pv-card">
              <h3 style={{ margin: '0 0 12px 0', color: '#fff' }}>TIV Marketplace (Earners View)</h3>
              <div className="muted" style={{ marginBottom: '24px' }}>
                Earners cannot buy TIVs here. Creators buy packs to fund campaigns. Below are public sell orders and buy interest insights.
              </div>
              
              <h4 style={{ margin: '0 0 12px 0', color: '#fff' }}>Public Sell Orders</h4>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <strong>Earner_001</strong>
                    <div className="muted">500 TIV • $18</div>
                  </div>
                  <button className="pv-btn-ghost" disabled>Buy (Creators only)</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                  <div>
                    <strong>Earner_002</strong>
                    <div className="muted">2500 TIV • $90</div>
                  </div>
                  <button className="pv-btn-ghost" disabled>Buy (Creators only)</button>
                </div>
              </div>

              <h4 style={{ margin: '0 0 12px 0', color: '#fff' }}>Creator Interest (sample)</h4>
              <div className="muted">
                Creators are currently buying TIV packs for campaign funding — this is informational only.
              </div>
              <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                High demand for short ad packs (15–30s).
              </div>
            </div>
          </div>
        )}

        {/* WITHDRAW VIEW */}
        {currentView === 'withdraw' && (
          <div>
            <div className="pv-card">
              <h3 style={{ margin: '0 0 12px 0', color: '#fff' }}>Withdraw Rewards</h3>
              <div className="muted" style={{ marginBottom: '24px' }}>
                Before your first withdrawal, verification is required (ID, address, phone). Large withdrawals may trigger additional checks.
              </div>

              <div style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
                <div>
                  <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Full name</label>
                  <input
                    type="text"
                    className="pv-input"
                    placeholder="Jane Doe"
                    value={verificationData.name}
                    onChange={(e) => setVerificationData({ ...verificationData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Address</label>
                  <input
                    type="text"
                    className="pv-input"
                    placeholder="Street, City, State, Zip"
                    value={verificationData.address}
                    onChange={(e) => setVerificationData({ ...verificationData, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Phone</label>
                  <input
                    type="tel"
                    className="pv-input"
                    placeholder="+1 555 555 5555"
                    value={verificationData.phone}
                    onChange={(e) => setVerificationData({ ...verificationData, phone: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button className="pv-btn-ghost" onClick={handleVerification}>Verify</button>
                  <button className="pv-btn-primary" onClick={handleWithdraw}>Request Withdrawal</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE VIEW */}
        {currentView === 'profile' && (
          <div>
            <div className="pv-card">
              <h3 style={{ margin: '0 0 12px 0', color: '#fff' }}>Profile</h3>
              <div className="muted" style={{ marginBottom: '24px' }}>
                Edit your name and password. Verified status appears here.
              </div>

              <div style={{ display: 'grid', gap: '16px', maxWidth: '600px' }}>
                <div>
                  <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Full name</label>
                  <input type="text" className="pv-input" placeholder="Your name" />
                </div>
                <div>
                  <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Email</label>
                  <input type="email" className="pv-input" disabled placeholder="demo@profitiv.app" />
                </div>
                <div>
                  <label className="muted" style={{ display: 'block', marginBottom: '6px' }}>Current Plan</label>
                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>
                      {profile?.subscription_plan || 'Starter'}
                    </div>
                    <div className="muted">
                      Weekly limit: ${planLimits.weekly} | Monthly cap: ${planLimits.monthly}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                  <button className="pv-btn-ghost" onClick={() => toast({ title: "Profile Saved", description: "Demo: Hook to /api/user/profile to persist" })}>
                    Save
                  </button>
                  <button className="pv-btn-primary" onClick={() => toast({ title: "Upgrade Plan", description: "Demo: Hook to subscription checkout" })}>
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Legal Notice */}
      <div style={{
        padding: '20px 40px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '40px'
      }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          <strong>Legal:</strong> Rewards shown here are earned from verified engagement activity on Profitiv. This platform is a marketing & engagement service — not an investment product.
          Withdrawals, payouts, and marketplace trades require backend payment integration and verification.
        </p>
      </div>
    </div>
  );
};

export default EarnerDashboard;
