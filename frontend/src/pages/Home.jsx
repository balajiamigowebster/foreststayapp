import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, MapPin, Users, Star, ArrowRight, ShieldCheck, Heart, Leaf } from 'lucide-react';

const Home = () => {
  const { API_BASE } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredCabins, setFeaturedCabins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search parameters state
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('1');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE}/cabins`);
        if (res.ok) {
          const data = await res.json();
          // Take the first 3 cabins as featured
          setFeaturedCabins(data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching cabins for homepage:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [API_BASE]);

  const handleSearch = (e) => {
    e.preventDefault();
    let query = `/cabins?`;
    if (location) query += `location=${encodeURIComponent(location)}&`;
    if (guests) query += `guests=${guests}`;
    navigate(query);
  };

  return (
    <div className="fade-in" style={{ paddingTop: '100px' }}>
      {/* Hero Section */}
      <section className="hero-section" style={{
        position: 'relative',
        height: '80vh',
        minHeight: '550px',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(rgba(14, 47, 34, 0.45), rgba(14, 47, 34, 0.7)), url("https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=1920") no-repeat center center/cover',
        borderRadius: '0 0 var(--border-radius-lg) var(--border-radius-lg)',
        color: 'white',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '650px', marginBottom: '40px' }}>
            <span style={{ 
              display: 'inline-block',
              backgroundColor: 'rgba(197, 160, 89, 0.25)', 
              color: 'var(--gold-accent)', 
              border: '1px solid rgba(197, 160, 89, 0.4)', 
              padding: '6px 16px', 
              borderRadius: '20px', 
              fontSize: '0.85rem', 
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '20px'
            }}>Escape to the Wilderness</span>
            <h1 style={{ color: 'white', fontSize: '3.5rem', marginBottom: '20px', lineHeight: '1.15' }}>
              Find Your Sanctuary in the Forest
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#dae6df', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              Discover luxurious cabin hideaways designed for disconnecting from the noise and reconnecting with what matters.
            </p>
          </div>

          {/* Search Form Panel */}
          <form onSubmit={handleSearch} className="glass-panel" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            padding: '24px 30px',
            borderRadius: '20px',
            maxWidth: '900px',
            width: '100%',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.92)',
            color: 'var(--dark-text)'
          }}>
            <div style={{ flex: 2, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-medium)', textTransform: 'uppercase' }}>
                <MapPin size={14} style={{ color: 'var(--gold-accent)' }} /> Destination
              </label>
              <input 
                type="text" 
                placeholder="Where to? (e.g. Redwood, Blue Ridge)" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ padding: '10px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.95rem' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: '130px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-medium)', textTransform: 'uppercase' }}>
                <Users size={14} style={{ color: 'var(--gold-accent)' }} /> Guests
              </label>
              <select 
                value={guests} 
                onChange={(e) => setGuests(e.target.value)}
                style={{ padding: '10px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '0.95rem', background: '#fff' }}
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="6">6+ Guests</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', paddingTop: '15px' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '14px 35px', borderRadius: '10px' }}>
                <Search size={18} /> Search Stays
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Cabins Section */}
      <section className="section-padding container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '45px' }}>
          <div>
            <span style={{ color: 'var(--gold-accent)', textTransform: 'uppercase', fontWeight: '600', fontSize: '0.85rem', letterSpacing: '0.5px' }}>Highly Curated</span>
            <h2 style={{ fontSize: '2.5rem', marginTop: '5px' }}>Our Featured Stays</h2>
          </div>
          <Link to="/cabins" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: 'var(--primary-medium)', borderBottom: '1px solid var(--primary-medium)' }}>
            View All Stays <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'var(--light-text)' }}>Loading unique stays...</p>
          </div>
        ) : (
          <div className="grid-3">
            {featuredCabins.map(cabin => (
              <article className="cabin-card" key={cabin.id}>
                <div className="cabin-card-image">
                  <img src={cabin.image_url} alt={cabin.name} />
                  <div className="cabin-card-rating">
                    <Star size={14} /> <span>{cabin.rating || 'New'}</span>
                  </div>
                </div>
                <div className="cabin-card-content">
                  <div className="cabin-card-location">
                    <MapPin size={14} /> {cabin.location}
                  </div>
                  <h3 className="cabin-card-title">{cabin.name}</h3>
                  <p className="cabin-card-desc">{cabin.description}</p>
                  <div className="cabin-card-footer">
                    <div className="cabin-card-price">
                      ${cabin.price_per_night} <span>/ night</span>
                    </div>
                    <Link to={`/cabins/${cabin.id}`} className="btn btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Core Brand Value Props */}
      <section style={{ backgroundColor: 'var(--sage-mist)', padding: '90px 0', borderRadius: '30px' }} className="container">
        <div className="container" style={{ maxWidth: '1000px', textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '15px' }}>What Makes a ForestStay Unique?</h2>
          <p style={{ color: 'var(--light-text)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            We bridge the gap between rugged nature exploration and five-star hospitality, assuring peace of mind.
          </p>
        </div>

        <div className="grid-3 container">
          <div style={{ background: '#fff', padding: '40px 30px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: 'var(--sage-mist)', width: '55px', height: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary-medium)' }}>
              <Leaf size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontFamily: '"Outfit", sans-serif', fontWeight: '600' }}>Eco-Conscious Comfort</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--light-text)' }}>
              Our cabins operate with low ecological footprints, harnessing solar energy and water conservation systems.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '40px 30px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: 'var(--sage-mist)', width: '55px', height: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary-medium)' }}>
              <ShieldCheck size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontFamily: '"Outfit", sans-serif', fontWeight: '600' }}>Vetted Wilderness Locations</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--light-text)' }}>
              Every location has been personally verified for accessibility, safety, isolation, and direct nature access.
            </p>
          </div>

          <div style={{ background: '#fff', padding: '40px 30px', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ backgroundColor: 'var(--sage-mist)', width: '55px', height: '55px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary-medium)' }}>
              <Heart size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontFamily: '"Outfit", sans-serif', fontWeight: '600' }}>Premium Amenities Included</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--light-text)' }}>
              From hot tubs and stone hearths to fully equipped kitchens, we verify that luxury is always present.
            </p>
          </div>
        </div>
      </section>

      {styleHelper}
    </div>
  );
};

const styleHelper = (
  <style>{`
    @media (max-width: 768px) {
      .hero-section {
        height: auto !important;
        padding: 60px 0 !important;
      }
      .hero-section h1 {
        font-size: 2.3rem !important;
      }
    }
  `}</style>
);

export default Home;
