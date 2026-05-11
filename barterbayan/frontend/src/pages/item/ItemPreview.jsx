import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import NavBar          from "../../components/NavBar";
import TradeOfferModal from "../../components/TradeOfferModal";
import "./ItemPreview.css";
 
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff/3600000);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}
 
function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`star ${n <= Math.round(rating) ? "filled" : ""}`}>&#9733;</span>
      ))}
    </span>
  );
}
 
export default function ItemPreview() {
  const { id }   = useParams();
  const { user } = useAuth();
  const [item,      setItem]      = useState(null);
  const [showOffer, setShowOffer] = useState(false);
 
  useEffect(() => {
    apiGet("/items/get_single_item.php", { item_id: id })
      .then(d => { if (d.success) setItem(d.item); });
  }, [id]);
 
  if (!item) return <p className="preview-loading">Loading...</p>;
 
  const isOwner = user?.user_id == item.user_id;
  const heroImg = item.images?.[0] ?? null;
 
  return (
    <div className="preview-screen">
      <NavBar />
 
      {/* ── Hero image ── */}
      <div className="preview-hero">
        {heroImg
          ? <img src={heroImg} alt={item.title} />
          : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"4rem"}}>&#x1F4E6;</div>
        }
        <span className="preview-hero-cond">{item.condition_status.replace("_"," ")}</span>
      </div>
 
      <div className="preview-content">
        /* Title + location */
        <div className="preview-title-row">
          <h2 className="preview-title">{item.title}</h2>
          {item.location && (
            <div className="preview-location">
              <span className="preview-loc-name">{item.location}</span>
              <span className="preview-loc-icon">&#x1F4CD;</span>
            </div>
          )}
        </div>
 
        /* Like / share / time */
        <div className="preview-actions">
          <button className="preview-action-btn" title="Like">&#9825;</button>
          <button className="preview-action-btn" title="Share">&#x1F517;</button>
          <span className="preview-time">&#x23F0; {timeAgo(item.created_at)}</span>
        </div>
 
        /* LOOKING FOR */
        {item.description && (
          <div className="preview-looking">
            <div className="preview-looking-label">&#x21C6; Looking For</div>
            <div className="preview-looking-val">{item.description}</div>
          </div>
        )}
 
        /* Description */
        <div>
          <p className="preview-desc-title">Description</p>
          <p className="preview-desc-text">{item.description || "No description provided."}</p>
        </div>
 
        /* Seller row */
        <div className="preview-seller">
          <div className="preview-seller-avatar">
            {item.profile_pic
              ? <img src={item.profile_pic} alt={item.username} />
              : item.username?.[0]?.toUpperCase()}
          </div>
          <div className="preview-seller-info">
            <span className="preview-seller-name">{item.username}</span>
            <div className="preview-seller-row">
              <Stars rating={4} />
              {item.is_verified == 1 && (
                <span className="preview-verified">&#10003; Verified</span>
              )}
            </div>
          </div>
          <button className="preview-chat-btn" title="Message">&#x1F4AC;</button>
        </div>
      </div>
 
      /* Sticky trade offer button */
      {!isOwner && (
        <button className="btn-primary preview-offer-btn" onClick={() => setShowOffer(true)}>
          &#x21C6; Make a Trade Offer
        </button>
      )}
 
      {showOffer && <TradeOfferModal targetItem={item} onClose={() => setShowOffer(false)} />}
    </div>
  );
}
