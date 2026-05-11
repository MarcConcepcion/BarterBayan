import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import NavBar       from "../../components/NavBar";
import ItemCard     from "../../components/ItemCard";
import ReviewCard   from "../../components/ReviewCard";
import PostReviewModal from "../../components/PostReviewModal";
import "./ProfilePage.css";
 
function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`star ${n <= Math.round(rating) ? "filled" : ""}`}>&#9733;</span>
      ))}
    </span>
  );
}
 
export default function ProfilePage() {
  const { id }   = useParams();
  const { user } = useAuth();
  const [profile,     setProfile]     = useState(null);
  const [items,       setItems]       = useState([]);
  const [reviews,     setReviews]     = useState([]);
  const [avgRating,   setAvgRating]   = useState(0);
  const [showReview,  setShowReview]  = useState(false);
 
  useEffect(() => {
    apiGet("/users/get_profile.php",    { user_id: id }).then(d => { if (d.success) setProfile(d.user); });
    apiGet("/items/get_user_items.php", { user_id: id }).then(d => { if (d.success) setItems(d.items); });
    apiGet("/reviews/get_reviews.php",  { reviewee_id: id }).then(d => {
      if (d.success) { setReviews(d.reviews); setAvgRating(d.avg_rating); }
    });
  }, [id]);
 
  if (!profile) return <p className="profile-loading">Loading...</p>;
 
  const isOwnProfile = user?.user_id == id;
  const joinYear = new Date(profile.created_at || Date.now()).getFullYear();
 
  return (
    <div className="profile-screen">
      <NavBar />
 
      {/* ── Hero ── */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {profile.profile_pic
              ? <img src={profile.profile_pic} alt={profile.username} />
              : <span className="profile-avatar-icon">&#x1F464;</span>}
          </div>
          {profile.is_verified == 1 && (
            <span className="profile-verified-badge">&#10003;</span>
          )}
        </div>
 
        <p className="profile-location">&#x1F4CD; {profile.location || "Location not set"}</p>
        {avgRating > 0 && (
          <p className="profile-rating">
            <Stars rating={avgRating} />
            <span className="profile-rating-val">{avgRating} Rating</span>
          </p>
        )}
        <p className="profile-member">&#x23F0; Member since {joinYear}</p>
 
        <div className="profile-actions">
          {isOwnProfile ? (
            <button className="btn-secondary profile-btn">&#x270E; Edit Profile</button>
          ) : (
            <button className="btn-secondary profile-btn" onClick={() => setShowReview(true)}>
              &#x2605; Leave a Review
            </button>
          )}
          {isOwnProfile && (
            <button className="profile-logout-btn">&#x2192; Logout</button>
          )}
        </div>
 
        {/* Stats row */}
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-num profile-stat-green">{reviews.length}</span>
            <span className="profile-stat-label">COMPLETED<br/>TRADES</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat">
            <span className="profile-stat-num profile-stat-red">{items.filter(i=>i.status==="available").length}</span>
            <span className="profile-stat-label">ACTIVE<br/>LISTINGS</span>
          </div>
        </div>
      </div>
 
      {/* ── Active Listings ── */}
      <div className="profile-section">
        <h3 className="profile-section-title">
          <span className="profile-section-icon">&#x1F4E6;</span> My Active Listings
        </h3>
        {items.filter(i=>i.status==="available").length === 0 ? (
          <div className="profile-empty-state">
            <span className="profile-empty-icon">&#x1F4E6;</span>
            <p className="profile-empty-msg">You don't have any active listings right now.</p>
            <p className="profile-empty-hint">Post an item to start trading!</p>
          </div>
        ) : (
          <div className="profile-grid">
            {items.filter(i=>i.status==="available").map(item => (
              <ItemCard key={item.item_id} item={item} />
            ))}
          </div>
        )}
      </div>
 
      {/* ── Reviews ── */}
      <div className="profile-section">
        <h3 className="profile-section-title">
          <span className="profile-section-icon">&#x1F4AC;</span> My Reviews
        </h3>
        {reviews.length === 0 ? (
          <p className="profile-no-reviews">No reviews yet.</p>
        ) : (
          <div className="profile-reviews-list">
            {reviews.map(r => <ReviewCard key={r.review_id} review={r} />)}
          </div>
        )}
      </div>
 
      {showReview && (
        <PostReviewModal
          revieweeId={id}
          revieweeName={profile.username}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
}
