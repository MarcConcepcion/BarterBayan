import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapFilter from "./MapFilter";
import "./MapOverlay.css";
 
// Fix default Leaflet marker icon broken by Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
 
const DEFAULT_CENTER = [13.41, 121.17]; // Occidental Mindoro
 
export default function MapOverlay({ items = [], onClose }) {
  const [showFilter, setShowFilter] = useState(false);
  const [filterCat,  setFilterCat]  = useState("all");
 
  const visible = filterCat === "all"
    ? items
    : items.filter(i => i.category === filterCat);
 
  return (
    <>
      <div className="map-overlay">
        <div className="map-controls">
          <button className="map-btn" onClick={() => setShowFilter(true)}>&#128269; Filter</button>
          <button className="map-btn map-close" onClick={onClose}>&#10005; Close</button>
        </div>
        <MapContainer center={DEFAULT_CENTER} zoom={12} className="map-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {visible
            .filter(item => item.latitude && item.longitude)
            .map(item => (
              <Marker key={item.item_id} position={[item.latitude, item.longitude]}>
                <Popup>
                  <strong>{item.title}</strong><br />
                  {item.username} — {item.location}
                </Popup>
              </Marker>
            ))
          }
        </MapContainer>
      </div>
      {showFilter && (
        <MapFilter
          current={filterCat}
          onApply={(cat) => { setFilterCat(cat); setShowFilter(false); }}
          onClose={() => setShowFilter(false)}
        />
      )}
    </>
  );
}
