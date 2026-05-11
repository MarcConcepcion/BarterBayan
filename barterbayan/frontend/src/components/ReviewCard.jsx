import "./ReviewCard.css";
 
function Stars({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(n => (
        <span key={n} className={`star ${n <= rating ? "filled" : ""}`}>&#9733;</span>
      ))}
    </span>
  );
}
 
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days/7)} weeks ago`;
  return `${Math.floor(days/30)} months ago`;
}
 
export default function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-avatar">
          {review.reviewer_pic
            ? <img src={review.reviewer_pic} alt={review.reviewer_name} />
            : review.reviewer_name?.[0]?.toUpperCase()}
        </div>
        <div className="review-meta">
          <span className="review-name">{review.reviewer_name}</span>
          <div className="review-row">
            <Stars rating={review.rating} />
            <span className="review-time">• {timeAgo(review.created_at)}</span>
          </div>
        </div>
      </div>
      <p className="review-comment">{review.comment}</p>
    </div>
  );
}
