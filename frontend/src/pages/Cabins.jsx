import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Users, Star, SlidersHorizontal, RotateCcw } from 'lucide-react';

const Cabins = () => {
  const { API_BASE } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cabins, setCabins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States initialized from URL query parameters if present
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const fetchCabins = async () => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (guests) params.append('guests', guests);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const res = await fetch(`${API_BASE}/cabins?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCabins(data);
      }
    } catch (error) {
      console.error('Error fetching cabins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabins();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (location) params.location = location;
    if (guests) params.guests = guests;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setLocation('');
    setGuests('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="fade-in container" style={{ paddingTop: '130px', minHeight: '80vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <span style={{ color: 'var(--gold-accent)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.85rem' }}>Find Your Stay</span>
        <h1 style={{ fontSize: '2.8rem' }}>Explore Our Nature Retreats</h1>
      </div>

      {/* Dynamic Filter Panel */}
      <form onSubmit={handleFilterSubmit} className="glass-panel filter-bar">
        <div className="filter-group">
          <label><MapPin size={12} style={{ color: 'var(--gold-accent)', marginRight: '4px' }} /> Location</label>
          <input 
            type="text" 
            placeholder="Search location..." 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label><Users size={12} style={{ color: 'var(--gold-accent)', marginRight: '4px' }} /> Guests Capacity</label>
          <select 
            value={guests} 
            onChange={(e) => setGuests(e.target.value)}
            className="filter-input"
            style={{ background: '#fff' }}
          >
            <option value="">Any Guests</option>
            <option value="2">2+ Guests</option>
            <option value="4">4+ Guests</option>
            <option value="6">6+ Guests</option>
            <option value="8">8+ Guests</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price ($/night)</label>
          <input 
            type="number" 
            placeholder="No Min" 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)}
            className="filter-input"
            min="0"
          />
        </div>

        <div className="filter-group">
          <label>Max Price ($/night)</label>
          <input 
            type="number" 
            placeholder="No Max" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            className="filter-input"
            min="0"
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>
            <SlidersHorizontal size={16} /> Filter
          </button>
          <button type="button" onClick={handleResetFilters} className="btn btn-secondary" style={{ padding: '12px 16px', borderRadius: '8px' }}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </form>

      {/* Cabins Results Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ color: 'var(--light-text)' }}>Searching our forest archives...</p>
        </div>
      ) : cabins.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '10px' }}>No Cabins Found</h3>
          <p style={{ color: 'var(--light-text)', marginBottom: '20px' }}>We couldn\'t find any cabins matching your search details. Try modifying your location or price range.</p>
          <button onClick={handleResetFilters} className="btn btn-accent">Clear All Filters</button>
        </div>
      ) : (
        <div className="grid-3" style={{ marginBottom: '60px' }}>
          {cabins.map(cabin => (
            <article className="cabin-card fade-in" key={cabin.id}>
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
                
                {/* Visual Cabin Amenities Badges (Showing first 3) */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
                  {cabin.amenities && cabin.amenities.slice(0, 3).map(am => (
                    <span key={am.id} style={{ fontSize: '0.75rem', backgroundColor: 'var(--sage-mist)', color: 'var(--primary-medium)', padding: '3px 8px', borderRadius: '4px', fontWeight: '500' }}>
                      {am.name}
                    </span>
                  ))}
                  {cabin.amenities && cabin.amenities.length > 3 && (
                    <span style={{ fontSize: '0.75rem', backgroundColor: 'transparent', border: '1px dashed var(--primary-light)', color: 'var(--primary-medium)', padding: '2px 6px', borderRadius: '4px' }}>
                      +{cabin.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <p className="cabin-card-desc">{cabin.description}</p>
                <div className="cabin-card-footer">
                  <div className="cabin-card-price">
                    ${cabin.price_per_night} <span>/ night</span>
                  </div>
                  <Link to={`/cabins/${cabin.id}`} className="btn btn-accent" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                    View Stay
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cabins;
