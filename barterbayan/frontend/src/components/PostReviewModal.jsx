import { useState } from "react";
import { apiPost } from "../utils/api";
import "./PostReviewModal.css";
 
function StarPicker({ value, onChange }) {
  return (
    <div className="star-picker">
      {[1,2,3,4,5].map(n => (
        <button key={n} type="button"
          className={`star-pick ${n <= value ? "filled" : ""}`}
          onClick={() => onChange(n)}>
          &#9733;
        </button>
      ))}
    </div>
  );
}
 
export default function PostReviewModal({ revieweeId, revieweeName, offerId, onClose }) {
  const [rating,  setRating]  = useState(5);
  const [comment, setComment] = useState("");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(false);
 
  const handleSubmit = async () => {
    if (!comment.trim()) { setError("Please write a comment."); return; }
    setSaving(true);
    const data = await apiPost("/reviews/post_review.php", {
      reviewee_id: revieweeId,
      offer_id:    offerId ?? null,
      rating,
      comment,
    });
    setSaving(false);
    if (data.success) { setDone(true); }
    else { setError(data.message); }
  };
 
  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="review-modal" onClick={e => e.stopPropagation()}>
        {done ? (
          <div className="review-modal-done">
            <p className="review-done-icon">&#10003;</p>
            <p className="review-done-msg">Review posted!</p>
            <button className="btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2 className="modal-title">Review {revieweeName}</h2>
              <button className="modal-close" onClick={onClose}>&times;</button>
            </div>
            <p className="review-modal-sub">How was your trade experience?</p>
            <StarPicker value={rating} onChange={setRating} />
            <textarea className="form-field review-textarea"
              placeholder="Share your experience with this trader..."
              value={comment} onChange={e => setComment(e.target.value)} />
            {error && <p className="review-modal-error">{error}</p>}
            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Posting..." : "Post Review"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
