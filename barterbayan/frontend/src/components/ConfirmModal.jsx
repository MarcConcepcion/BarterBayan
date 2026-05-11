import "./ConfirmModal.css";
 
export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-backdrop">
      <div className="confirm-box">
        <p className="confirm-icon">&#9888;</p>
        <h3 className="confirm-title">Confirm Action</h3>
        <p className="confirm-msg">{message}</p>
        <div className="confirm-actions">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary confirm-ok" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
