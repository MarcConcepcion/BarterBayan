import { useEffect, useState } from "react";
import { apiGet } from "../../utils/api";
import NavBar   from "../../components/NavBar";
import ItemCard from "../../components/ItemCard";
import "./LandingPage.css";
 
const CATEGORIES = ["all","electronics","vehicles","furniture","clothing","other"];
 
export default function LandingPage() {
  const [items,    setItems]    = useState([]);
  const [category, setCategory] = useState("all");
  const [loading,  setLoading]  = useState(true);
 
  useEffect(() => {
    setLoading(true);
    apiGet("/items/get_items.php", category !== "all" ? { category } : {})
      .then(data => { if (data.success) setItems(data.items); })
      .finally(() => setLoading(false));
  }, [category]);
 
 return (
    <div className="landing-screen">
      <NavBar />
 
      <div className="landing-hero">
        <h1 className="landing-heading">What do you want to trade<br/>for today?</h1>
        <p className="landing-sub">Browse items from people near you looking to swap.</p>
      </div>
 
      <div className="landing-search-row">
        <div className="landing-search">
          <span className="landing-search-icon">&#x1F50D;</span>
          <input placeholder="Search items..." />
        </div>
        <button className="landing-icon-btn" title="Map">&#x1F5FA;</button>
        <button className="landing-icon-btn" title="Filter">&#x25A6;</button>
      </div>
 
      <div className="landing-feed">
        {loading
          ? <p className="landing-state">Loading items...</p>
          : items.length === 0
            ? <p className="landing-state">No items yet. Be the first to post!</p>
            : items.map(item => <ItemCard key={item.item_id} item={item} />)
        }
      </div>
    </div>
  );

}
