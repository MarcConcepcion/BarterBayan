import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiGet, apiPost } from "../utils/api";
import ConfirmModal from "./ConfirmModal";
import "./TradeOfferModal.css";
 
export default function TradeOfferModal({ targetItem, onClose }) {
  const { user } = useAuth();
  const [myItems,    setMyItems]    = useState([]);
  const [selected,   setSelected]   = useState(null);
  const [cashTopup,  setCashTopup]  = useState(0);
  const [showConfirm,setShowConfirm]= useState(false);
  const [sent,       setSent]       = useState(false);
 
  useEffect(() => {
    apiGet("/items/get_user_items.php", { user_id: user.user_id })
      .then(d => { if (d.success) setMyItems(d.items.filter(i => i.status === "available")); });
  }, [user.user_id]);
 
  const handleSend = async () => {
    const data = await apiPost("/trades/send_offer.php", {
      receiver_id:        targetItem.user_id,
      offered_item_id:    selected.item_id,
      requested_item_id:  targetItem.item_id,
      cash_topup:         cashTopup,
    });
    if (data.success) setSent(true);
  };
 
  if (sent) return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="trade-modal sent-msg">
        <p>&#10003; Offer sent successfully!</p>
        <button className="btn-primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
 
  return (
    <>
      <div className="overlay-backdrop" onClick={onClose}>
        <div className="trade-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Make a Trade Offer</h2>
            <button className="modal-close" onClick={onClose}>&times;</button>
          </div>
          <p className="modal-sub">Select one of your items to offer for: <strong>{targetItem.title}</strong></p>
          <div className="offer-items-list">
            {myItems.length === 0 && <p className="offer-empty">You have no available items to offer.</p>}
            {myItems.map(item => (
              <div key={item.item_id}
                className={`offer-item-row ${selected?.item_id === item.item_id ? "selected" : ""}`}
                onClick={() => setSelected(item)}>
                <div className="offer-item-check">{selected?.item_id === item.item_id ? "●" : "○"}</div>
                <div>
                  <p className="offer-item-name">{item.title}</p>
                  <p className="offer-item-meta">{item.category} · {item.condition_status}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="offer-topup">
            <label className="offer-topup-label">Cash Top-up (₱) — optional</label>
            <input className="form-field" type="number" min="0"
              value={cashTopup} onChange={e => setCashTopup(Number(e.target.value))} />
          </div>
          <button className="btn-primary" disabled={!selected}
            onClick={() => setShowConfirm(true)}>
            Send Offer
          </button>
        </div>
      </div>
      {showConfirm && (
        <ConfirmModal
          message={`Offer your "${selected?.title}" for "${targetItem.title}"?`}
          onConfirm={handleSend}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
