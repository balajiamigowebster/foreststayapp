import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trees, Bell, Zap, X, Send, User, Compass, HelpCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout, viewMode, setViewMode, API_BASE } = useContext(AuthContext);
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  
  // AI chatbot states
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am Forest AI, your operations assistant. Ask me anything about campsite revenues, bookings, occupancy, or low inventory levels.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [alertsList, setAlertsList] = useState([
    'Hardwood BBQ Coal (i-04) is down to 4 kg. Minimum required is 10 kg.',
    'Booking FSB-2026-004 (Amit Verma) check-in today, balance amount ₹2,800 is pending.'
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        if (res.ok) {
          const data = await res.json();
          if (data.alerts && data.alerts.length > 0) {
            setAlertsList(data.alerts);
          }
        }
      } catch (err) {
        console.error('Error fetching navbar alerts:', err);
      }
    };
    fetchAlerts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleModeSwitch = (mode) => {
    setViewMode(mode);
    if (mode === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  // Chatbot logic parsing operational keywords to return real DB statistics
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatLoading(true);

    try {
      // Fetch fresh stats from the backend
      const res = await fetch(`${API_BASE}/dashboard/stats`);
      if (!res.ok) throw new Error('Stats fetch error');
      const stats = await res.json();

      let reply = "";
      const lower = userText.toLowerCase();

      if (lower.includes('income') || lower.includes('revenue') || lower.includes('sale') || lower.includes('money')) {
        reply = `Today's total income is ₹${stats.todayIncome.toLocaleString()}. Stays: ₹${stats.breakdown.stay.toLocaleString()}, Cafe: ₹${stats.breakdown.cafe.toLocaleString()}, Passes: ₹${stats.breakdown.passes.toLocaleString()}, Treks: ₹${stats.breakdown.treks.toLocaleString()}.`;
      } else if (lower.includes('occupancy') || lower.includes('occupy') || lower.includes('guests') || lower.includes('house')) {
        reply = `Campsite occupancy is currently at ${stats.occupancy.percentage}% (${stats.occupancy.occupiedUnits} of ${stats.occupancy.totalUnits} active units). We have ${stats.occupancy.guests} guests in-house today.`;
      } else if (lower.includes('stock') || lower.includes('inventory') || lower.includes('alert') || lower.includes('low') || lower.includes('coal')) {
        if (stats.alerts.length > 0) {
          reply = `Here are the operational alerts:\n` + stats.alerts.map(a => `• ${a}`).join('\n');
        } else {
          reply = "All stock levels are currently balanced and healthy! (All Stock OK).";
        }
      } else if (lower.includes('check-in') || lower.includes('checkin') || lower.includes('check out') || lower.includes('checkout') || lower.includes('arrival')) {
        reply = `We have ${stats.arrivals} check-in arrival(s) and ${stats.departures} check-out departure(s) scheduled for today.`;
      } else {
        reply = "I can help you audit campsite operations! Try asking me about:\n• 'income breakdown'\n• 'active occupancy'\n• 'low inventory stock'\n• 'check-ins today'";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
        setChatLoading(false);
      }, 600);

    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: "I'm having trouble fetching operational data right now. Please ensure the backend server is running." }]);
        setChatLoading(false);
      }, 500);
    }
  };

  return (
    <>
      <nav className={`glass-nav scrolled`}>
        {/* Logo Branding */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Trees size={24} style={{ color: '#2d6a4f' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f3823', fontFamily: '"Outfit", sans-serif', letterSpacing: '0.5px' }}>FOREST</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#e36414', fontFamily: '"Outfit", sans-serif', letterSpacing: '2px' }}>STAY CAFE</span>
          </div>
        </Link>

        {/* Backoffice vs Customer Mode Toggles (Screenshot details) */}
        <div style={{ display: 'flex', backgroundColor: 'rgba(0, 0, 0, 0.03)', padding: '4px', borderRadius: '30px', border: '1px solid rgba(0,0,0,0.04)' }}>
          <button 
            onClick={() => handleModeSwitch('backoffice')} 
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: viewMode === 'backoffice' ? 'var(--white)' : 'transparent',
              color: viewMode === 'backoffice' ? 'var(--primary-deep)' : 'var(--light-text)',
              boxShadow: viewMode === 'backoffice' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Compass size={14} /> <span className="mode-switch-text">Backoffice (Staff)</span>
          </button>
          <button 
            onClick={() => handleModeSwitch('customer')} 
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: '600',
              cursor: 'pointer',
              backgroundColor: viewMode === 'customer' ? 'var(--white)' : 'transparent',
              color: viewMode === 'customer' ? 'var(--primary-deep)' : 'var(--light-text)',
              boxShadow: viewMode === 'customer' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span className="mode-switch-text">Customer Portal</span>
          </button>
        </div>

        {/* Super Admin, AI Assistant, Notifications Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            <>
              {/* User Status Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f3823', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '700' }}>
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="user-text-details" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary-deep)' }}>{user.name}</span>
                  <span style={{ fontSize: '0.62rem', backgroundColor: '#e2f0d9', color: '#385723', padding: '1px 4px', borderRadius: '3px', fontWeight: '800', width: 'fit-content' }}>
                    {user.role === 'admin' ? 'SUPER ADMIN' : 'CUSTOMER'}
                  </span>
                </div>
              </div>

              {/* Forest AI Drawer Toggle */}
              <button 
                onClick={() => setAiOpen(true)}
                className="btn" 
                style={{ 
                  backgroundColor: '#0f3823', 
                  color: 'var(--white)', 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: 'none'
                }}
              >
                <Zap size={14} style={{ fill: 'var(--gold-accent)', color: 'var(--gold-accent)' }} /> <span className="forest-ai-text">Forest AI</span>
              </button>

              {/* Notifications Icon with Dynamic Badge */}
              <div 
                onClick={() => setNotifOpen(!notifOpen)}
                style={{ position: 'relative', cursor: 'pointer', color: 'var(--primary-deep)' }}
              >
                <Bell size={20} />
                {alertsList.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--error)',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {alertsList.length}
                  </span>
                )}
              </div>

              {/* Notifications Dropdown Panel */}
              {notifOpen && (
                <div style={{
                  position: 'absolute',
                  top: '55px',
                  right: '80px',
                  width: '340px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                  padding: '15px 20px',
                  zIndex: 1050,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--primary-deep)' }}>Campsite Alerts & Updates</strong>
                    <span style={{ fontSize: '0.72rem', backgroundColor: 'red', color: 'white', padding: '1px 6px', borderRadius: '10px', fontWeight: '700' }}>
                      {alertsList.length} New
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    {alertsList.length > 0 ? (
                      alertsList.map((alertItem, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.78rem', backgroundColor: '#fafafa', padding: '10px', borderRadius: '8px', borderLeft: '3px solid red', textAlign: 'left' }}>
                          <Bell size={13} style={{ color: 'red', flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ color: 'var(--primary-deep)', lineHeight: '1.3' }}>{alertItem}</div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '15px', color: 'var(--light-text)', fontSize: '0.8rem' }}>
                        No active alerts. All systems healthy!
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button onClick={logout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '15px' }}>
                Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.82rem', borderRadius: '15px' }}>Log In</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.82rem', borderRadius: '15px' }}>Sign Up</Link>
            </div>
          )}
        </div>
      </nav>

      {/* AI Assistant Drawer */}
      {aiOpen && (
        <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.15)', justifyContent: 'flex-end', alignItems: 'stretch' }} onClick={() => setAiOpen(false)}>
          <div className="ai-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="ai-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} style={{ fill: 'var(--gold-accent)', color: 'var(--gold-accent)' }} />
                <h3 style={{ color: 'white', fontFamily: '"Outfit", sans-serif', fontSize: '1.1rem' }}>Forest AI Ops Desk</h3>
              </div>
              <button onClick={() => setAiOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div className="ai-drawer-chat">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble chat-bubble-${msg.sender}`} style={{ whiteSpace: 'pre-line' }}>
                  {msg.text}
                </div>
              ))}
              {chatLoading && (
                <div className="chat-bubble chat-bubble-ai" style={{ fontStyle: 'italic', color: 'var(--light-text)' }}>
                  Auditing operations logs...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="ai-drawer-input">
              <input 
                type="text" 
                placeholder="Ask e.g. 'what is today's revenue?'..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)}
                style={{ flexGrow: 1, padding: '10px 14px', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', fontSize: '0.9rem' }}
                disabled={chatLoading}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px', borderRadius: '8px' }} disabled={chatLoading}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
