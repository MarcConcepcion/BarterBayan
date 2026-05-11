import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login       from "./pages/auth/Login";
import SignUp      from "./pages/auth/SignUp";
import LandingPage from "./pages/landing/LandingPage";
import ItemPreview from "./pages/item/ItemPreview";
import PostItem    from "./pages/item/PostItem";
import ProfilePage from "./pages/profile/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
 
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/"       element={<Navigate to="/login" replace />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
 
          {/* Protected routes — require login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home"        element={<LandingPage />} />
            <Route path="/item/:id"    element={<ItemPreview />} />
            <Route path="/post"        element={<PostItem />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
