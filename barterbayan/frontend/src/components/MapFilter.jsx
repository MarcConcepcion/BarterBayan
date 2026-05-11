import "./MapFilter.css";
 
const CATS = ["all","electronics","vehicles","furniture","clothing","other"];
 
export default function MapFilter({ current, onApply, onClose }) {
  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="map-filter-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Filter by Category</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="map-filter-list">
          {CATS.map(c => (
            <button key={c}
              className={`map-filter-item ${current === c ? "active" : ""}`}
              onClick={() => onApply(c)}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
