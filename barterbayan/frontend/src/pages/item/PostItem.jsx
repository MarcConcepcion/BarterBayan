import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../utils/api";
import NavBar from "../../components/NavBar";
import "./PostItem.css";
 
// Converts a File object to base64 string
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);   // includes data:image/...;base64,...
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
 
export default function PostItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", category: "other",
    condition_status: "good", swap_for: "",
  });
  const [imageFiles,    setImageFiles]    = useState([]);  // preview blobs
  const [uploadedUrls,  setUploadedUrls]  = useState([]);  // returned from PHP
  const [uploading,     setUploading]     = useState(false);
  const [error,         setError]         = useState("");
  const [saving,        setSaving]        = useState(false);
 
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
 
  // When user selects photos
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, 5);  // max 5 photos
    if (!files.length) return;
    setUploading(true);
    setError("");
 
    // Show local previews immediately
    setImageFiles(files.map(f => URL.createObjectURL(f)));
 
    try {
      const urls = [];
      for (const file of files) {
        const base64 = await fileToBase64(file);
        const data   = await apiPost("/items/upload_image.php", {
          image_data: base64,
          file_name:  file.name,
        });
        if (data.success) {
          urls.push(data.url);
        } else {
          setError(data.message || "Upload failed.");
          break;
        }
      }
      setUploadedUrls(urls);
    } catch (err) {
      setError("Upload error. Check XAMPP is running.");
    } finally {
      setUploading(false);
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    setSaving(true);
    const data = await apiPost("/items/post_item.php", {
      ...form,
      description: form.swap_for,    // reuse description as "looking for"
      images:      uploadedUrls,
    });
    setSaving(false);
    if (data.success) {
      navigate(`/item/${data.item_id}`);
    } else {
      setError(data.message);
    }
  };
 
  return (
    <div className="post-screen">
      <NavBar />
      <div className="post-body">
 
        {/* ── Image upload zone ── */}
        <div className="post-section">
          <div className="post-section-label">
            <span className="post-section-icon">&#x1F4F7;</span> Item Photos
          </div>
          <label className="post-upload-zone">
            <input type="file" accept="image/jpeg,image/png,image/webp"
              multiple style={{display:"none"}} onChange={handleFileChange} />
            {imageFiles.length === 0 ? (
              <div className="post-upload-placeholder">
                <span className="post-upload-icon">&#x2B06;</span>
                <span className="post-upload-text">Click to upload photos</span>
                <span className="post-upload-hint">JPG, PNG up to 5MB</span>
              </div>
            ) : (
              <div className="post-upload-previews">
                {imageFiles.map((src,i) => (
                  <img key={i} src={src} alt={`preview ${i}`} className="post-upload-thumb" />
                ))}
              </div>
            )}
          </label>
          {uploading && <p className="post-uploading">Uploading photos...</p>}
        </div>
 
        {/* ── Item details ── */}
        <div className="post-section">
          <div className="post-section-label">
            <span className="post-section-icon">&#x2139;</span> Item Details
          </div>
          <div className="post-fields">
            <div>
              <label className="post-label">What are you trading?</label>
              <input className="form-field" name="title"
                placeholder="e.g., Mountain Bike, iPhone 13, etc."
                value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="post-label">Category</label>
              <select className="form-field" name="category" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="vehicles">Vehicles</option>
                <option value="furniture">Furniture</option>
                <option value="clothing">Clothing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="post-label">Description</label>
              <textarea className="form-field post-textarea" name="description"
                placeholder="Describe your item, its features, history, and any flaws..."
                value={form.description} onChange={handleChange} />
            </div>
          </div>
        </div>
 
        {/* ── What do you want in return ── */}
        <div className="post-section post-section-swap">
          <div className="post-section-label post-section-label-swap">
            <span>&#x21C6;</span> What do you want in return?
          </div>
          <label className="post-label">Your requested swap</label>
          <input className="form-field" name="swap_for"
            placeholder="e.g., Sacks of rice, tumbler, cash, or..."
            value={form.swap_for} onChange={handleChange} />
          <p className="post-swap-hint">Be as specific as possible to get the best offers.</p>
        </div>
 
        {error && <p className="post-error">{error}</p>}
 
        <div className="post-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button type="button" className="btn-primary post-submit"
            disabled={saving || uploading} onClick={handleSubmit}>
            {saving ? "Posting..." : "Post Item for Trade"}
          </button>
        </div>
 
      </div>
    </div>
  );
}
