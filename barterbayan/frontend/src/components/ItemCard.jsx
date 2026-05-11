import { useNavigate } from "react-router-dom";
import "./ItemCard.css";
 
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff/60000);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m/60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}
 
export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const thumb    = item.images?.[0] ?? null;
 
  return (
    <div className="item-card" onClick={() => navigate(`/item/${item.item_id}`)}>
      <div className="item-card-img">
        {thumb
          ? <img src={thumb} alt={item.title} />
          : <div className="item-card-placeholder">&#x1F4E6;</div>
        }
        <span className="item-card-cond">{item.condition_status.replace("_"," ")}</span>
        {item.location && (
          <span className="item-card-loc">&#x1F4CD; {item.location}</span>
        )}
      </div>
 
      <div className="item-card-body">
        <div className="item-card-seller">
          <div className="item-card-avatar">
            {item.profile_pic
              ? <img src={item.profile_pic} alt={item.username} />
              : item.username?.[0]?.toUpperCase()}
          </div>
          <span className="item-card-seller-name">{item.username}</span>
          <span className="item-card-time">{timeAgo(item.created_at)}</span>
        </div>
 
        <p className="item-card-title">{item.title}</p>
 
        {item.description && (
          <div className="item-card-looking">
            <div className="item-card-looking-label">&#x21C6; Looking For</div>
            <div className="item-card-looking-val">{item.description}</div>
          </div>
        )}
      </div>
    </div>
  );
}
