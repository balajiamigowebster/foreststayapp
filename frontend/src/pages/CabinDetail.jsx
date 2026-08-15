import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as Icons from 'lucide-react';
import { Calendar, Users, Star, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';

const CabinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user, API_BASE } = useContext(AuthContext);

  const [cabin, setCabin] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState('1');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingAlert, setBookingAlert] = useState(null); // { type: 'success'|'error', msg: '' }

  // Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewAlert, setReviewAlert] = useState(null);

  const fetchCabin = async () => {
    try {
      const res = await fetch(`${API_BASE}/cabins/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCabin(data);
      } else {
        navigate('/cabins');
      }
    } catch (error) {
      console.error('Error fetching cabin:', error);
      navigate('/cabins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCabin();
  }, [id]);

  // Helper for dynamic icon loading from Lucide
  const renderAmenityIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent size={20} style={{ color: 'var(--primary-medium)' }} /> : <Icons.HelpCircle size={20} />;
  };

  // Live Price Calculation
  const calculateTotal = () => {
    if (!checkIn || !checkOut || !cabin) return 0;
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * cabin.price_per_night : 0;
  };

  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!token) {
      setBookingAlert({ type: 'error', msg: 'You must be logged in to book a stay.' });
      return;
    }

    setBookingLoading(true);
    setBookingAlert(null);

    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cabin_id: cabin.id,
          check_in: checkIn,
          check_out: checkOut,
          guests_count: parseInt(guestsCount)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setBookingAlert({ type: 'success', msg: 'Booking confirmed! Redirecting to dashboard...' });
        setCheckIn('');
        setCheckOut('');
        setGuestsCount('1');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setBookingAlert({ type: 'error', msg: data.message || 'Failed to book cabin.' });
      }
    } catch (err) {
      console.error(err);
      setBookingAlert({ type: 'error', msg: 'Network error booking stay.' });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;

    setReviewLoading(true);
    setReviewAlert(null);

    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cabin_id: cabin.id,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (res.ok) {
        setReviewAlert({ type: 'success', msg: 'Thank you for your feedback!' });
        setComment('');
        setRating(5);
        fetchCabin(); // Reload reviews list & new score rating
      } else {
        setReviewAlert({ type: 'error', msg: data.message || 'Failed to submit review' });
      }
    } catch (err) {
      console.error(err);
      setReviewAlert({ type: 'error', msg: 'Network error submitting review' });
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '150px 0', minHeight: '80vh' }}>
        <p style={{ color: 'var(--light-text)' }}>Unveiling cabin secrets...</p>
      </div>
    );
  }

  const days = calculateDays();
  const totalPrice = calculateTotal();

  return (
    <div className="fade-in container" style={{ paddingTop: '120px' }}>
      
      {/* Photo Banner Header */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ position: 'relative', height: '450px', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <img src={cabin.image_url} alt={cabin.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '40px', background: 'linear-gradient(transparent, rgba(14, 47, 34, 0.95))', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--gold-accent)', fontWeight: '600', marginBottom: '8px' }}>
                <Icons.MapPin size={16} /> {cabin.location}
              </div>
              <h1 style={{ color: 'white', fontSize: '2.8rem', textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>{cabin.name}</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '15px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
              <Star size={18} style={{ color: 'var(--gold-accent)', fill: 'var(--gold-accent)' }} />
              <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>{cabin.rating || 'New'}</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>({cabin.reviews?.length || 0} reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout splits Content vs Booking Widget */}
      <div className="grid-2" style={{ alignItems: 'flex-start', marginBottom: '60px' }}>
        
        {/* Left Panel: Description, Amenities, Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* Description Block */}
          <div className="glass-panel" style={{ padding: '35px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles style={{ color: 'var(--gold-accent)' }} /> About the Cabin
            </h2>
            <p style={{ color: 'var(--light-text)', fontSize: '1.05rem', lineHeight: '1.7' }}>
              {cabin.description}
            </p>
            <div style={{ marginTop: '25px', display: 'flex', gap: '20px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--light-text)' }}>Max Occupancy</span>
                <p style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--primary-deep)' }}>{cabin.max_guests} Guests</p>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(0,0,0,0.06)' }}></div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--light-text)' }}>Price Base</span>
                <p style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--primary-deep)' }}>${cabin.price_per_night} / Night</p>
              </div>
            </div>
          </div>

          {/* Amenities block */}
          <div className="glass-panel" style={{ padding: '35px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '25px' }}>Offered Amenities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {cabin.amenities && cabin.amenities.map(am => (
                <div key={am.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--sage-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {renderAmenityIcon(am.icon)}
                  </div>
                  <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{am.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          <div className="glass-panel" style={{ padding: '35px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare style={{ color: 'var(--primary-medium)' }} /> Stays Feedback ({cabin.reviews?.length || 0})
            </h2>

            {/* Submit new review form */}
            {token ? (
              <form onSubmit={handleReviewSubmit} style={{ marginBottom: '35px', paddingBottom: '30px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Write a Review</h4>
                {reviewAlert && (
                  <div className={`alert alert-${reviewAlert.type}`}>
                    {reviewAlert.msg}
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label>Select Rating</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icons.Star 
                        key={star}
                        size={24}
                        onClick={() => setRating(star)}
                        style={{
                          color: star <= rating ? 'var(--gold-accent)' : '#ccc',
                          fill: star <= rating ? 'var(--gold-accent)' : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label>Your Review</label>
                  <textarea 
                    rows="3" 
                    placeholder="Describe your cozy stay..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                    required
                  ></textarea>
                </div>

                <button type="submit" disabled={reviewLoading} className="btn btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '0.9rem' }}>
                  {reviewLoading ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div style={{ backgroundColor: 'var(--sage-mist)', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={20} style={{ color: 'var(--primary-medium)' }} />
                <span style={{ fontSize: '0.9rem' }}>Want to review this stay? <Link to="/login" style={{ fontWeight: '600', textDecoration: 'underline' }}>Log In</Link> first.</span>
              </div>
            )}

            {/* List */}
            {cabin.reviews && cabin.reviews.length === 0 ? (
              <p style={{ color: 'var(--light-text)' }}>No reviews yet. Be the first to share your experience!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {cabin.reviews?.map(rev => (
                  <div key={rev.id} style={{ padding: '20px', backgroundColor: 'var(--cream-base)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: '600' }}>{rev.user_name}</span>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Icons.Star key={i} size={14} style={{ color: 'var(--gold-accent)', fill: 'var(--gold-accent)' }} />
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--light-text)', fontStyle: 'italic' }}>"{rev.comment}"</p>
                    <span style={{ fontSize: '0.75rem', color: '#9e9e9e', display: 'block', marginTop: '10px' }}>
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Panel: Sticky Booking Form */}
        <div className="form-card sticky-widget" style={{ position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Book Cabin</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', marginBottom: '25px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-deep)' }}>${cabin.price_per_night}</span>
            <span style={{ color: 'var(--light-text)', fontSize: '0.95rem', marginBottom: '4px' }}>/ night</span>
          </div>

          {bookingAlert && (
            <div className={`alert alert-${bookingAlert.type}`} style={{ fontSize: '0.9rem' }}>
              {bookingAlert.msg}
            </div>
          )}

          <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={16} /> Check-In Date
              </label>
              <input 
                type="date" 
                value={checkIn} 
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Calendar size={16} /> Check-Out Date
              </label>
              <input 
                type="date" 
                value={checkOut} 
                min={checkIn ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={16} /> Guest Count
              </label>
              <select 
                value={guestsCount} 
                onChange={(e) => setGuestsCount(e.target.value)}
                className="form-input"
                style={{ background: '#fff' }}
              >
                {[...Array(cabin.max_guests)].map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>{idx + 1} Guest{idx > 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            {/* Dynamic Receipt display */}
            {days > 0 && (
              <div style={{ backgroundColor: 'var(--sage-mist)', padding: '20px', borderRadius: '12px', margin: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>${cabin.price_per_night} x {days} nights</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                  <span>Cleaning & Service fee</span>
                  <span style={{ color: 'green' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.05rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '8px', marginTop: '8px' }}>
                  <span>Total Cost</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button type="submit" disabled={bookingLoading} className="btn btn-primary" style={{ padding: '14px', borderRadius: '10px', width: '100%', fontSize: '1rem', fontWeight: '600' }}>
              {bookingLoading ? 'Securing Stay...' : 'Confirm Stay Booking'}
            </button>
          </form>
        </div>

      </div>

      <style>{`
        .sticky-widget {
          position: -webkit-sticky;
          position: sticky;
          top: 120px;
        }
        @media (max-width: 1024px) {
          .sticky-widget {
            position: static !important;
          }
        }
      `}</style>

    </div>
  );
};

export default CabinDetail;
