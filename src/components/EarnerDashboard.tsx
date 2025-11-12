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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f12] via-[#1a1133] to-[#0a1a2b]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const usdEquivalent = profile ? (profile.tiv_balance * profile.tiv_to_usd_rate).toFixed(2) : '0.00';

  return (
    <div
      style={{
        background: 'linear-gradient(120deg, #0f0f12 0%, #1a1133 60%, #0a1a2b 100%)',
        minHeight: '100vh',
        color: '#E9F0FF',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
      <style>{`
        .pv-card { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 18px; box-shadow: 0 10px 30px rgba(1,2,6,0.5); border: 1px solid rgba(255,255,255,0.05); }
        .pv-card h4 { margin: 0 0 6px; color: #B9C2E6; font-weight: 700; font-size: 13px; }
        .pv-card .big { font-size: 24px; font-weight: 800; margin-top: 6px; color: #FFFFFF; }
        .pv-btn-primary { padding: 10px 16px; border-radius: 10px; border: 0; cursor: pointer; font-weight: 700; background: linear-gradient(90deg, #7c3aed, #00bfff); color: #081021; }
        .pv-btn-ghost { padding: 10px 16px; border-radius: 10px; cursor: pointer; font-weight: 700; background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #E9F0FF; }
        .pv-input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); background: transparent; color: #E9F0FF; }
        .bar { height: 10px; background: rgba(255,255,255,0.04); border-radius: 999px; overflow: hidden; }
        .bar-fill { display: block; height: 100%; background: linear-gradient(90deg, #00bfff, #7c3aed); transition: width 0.6s ease; }
        .muted { color: #A6B0D6; font-size: 13px; }
      `}</style>

      {/* Header - NO HOME LINK for signed-in earners */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ color: '#00bfff', fontWeight: 800, letterSpacing: '0.5px', margin: 0, fontSize: '24px' }}>Profitiv</h2>
          <div className="muted" style={{ fontSize: '12px' }}>Earners Dashboard</div>
        </div>
        <nav style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}
            style={{
              color: currentView === 'dashboard' ? '#00bfff' : 'rgba(233,240,255,0.9)',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '8px 10px',
              borderRadius: '8px',
              background: currentView === 'dashboard' ? 'rgba(0,191,255,0.08)' : 'transparent'
            }}
          >
            Dashboard
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('campaigns'); }}
            style={{
              color: currentView === 'campaigns' ? '#00bfff' : 'rgba(233,240,255,0.9)',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '8px 10px',
              borderRadius: '8px',
              background: currentView === 'campaigns' ? 'rgba(0,191,255,0.08)' : 'transparent'
            }}
          >
            Campaigns
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('marketplace'); }}
            style={{
              color: currentView === 'marketplace' ? '#00bfff' : 'rgba(233,240,255,0.9)',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '8px 10px',
              borderRadius: '8px',
              background: currentView === 'marketplace' ? 'rgba(0,191,255,0.08)' : 'transparent'
            }}
          >
            Marketplace
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('withdraw'); }}
            style={{
              color: currentView === 'withdraw' ? '#00bfff' : 'rgba(233,240,255,0.9)',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '8px 10px',
              borderRadius: '8px',
              background: currentView === 'withdraw' ? 'rgba(0,191,255,0.08)' : 'transparent'
            }}
          >
            Withdraw
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentView('profile'); }}
            style={{
              color: currentView === 'profile' ? '#00bfff' : 'rgba(233,240,255,0.9)',
              textDecoration: 'none',
              fontWeight: 600,
              padding: '8px 10px',
              borderRadius: '8px',
              background: currentView === 'profile' ? 'rgba(0,191,255,0.08)' : 'transparent'
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
            {/* Top Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              <div className="pv-card">
                <h4>Total TIVs Earned</h4>
                <div className="big">{profile?.tiv_balance.toLocaleString() || '0'}</div>
                <div className="muted">TIV balance available</div>
              </div>
              <div className="pv-card">
                <h4>Total Cash Value</h4>
                <div className="big">≈ ${usdEquivalent}</div>
                <div className="muted">USD equivalent (display only)</div>
              </div>
              <div className="pv-card">
                <h4>Weekly Withdraw Progress</h4>
                <div className="big">
                  ${profile?.weekly_withdraw_used || 0} / ${planLimits.weekly}
                </div>
                <div className="muted">Plan limits enforced automatically</div>
              </div>
              <div className="pv-card">
                <h4>Subscription</h4>
                <div className="big">{profile?.subscription_plan || 'Starter'}</div>
                <div className="muted">Monthly cap: ${planLimits.monthly}</div>
              </div>
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
