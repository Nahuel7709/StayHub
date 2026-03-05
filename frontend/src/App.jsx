import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import AdminCreate from "./pages/admin/AdminCreate";
import AccommodationDetail from "./pages/AccommodationDetail";
import Footer from "./components/Footer";
import AccommodationsList from "./pages/AccommodationsList";
import AdminList from "./pages/admin/AdminList";
import AdminLayout from "./pages/admin/AdminLayout";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-secondary font-sans">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accommodations" element={<AccommodationsList />} />
          <Route path="/accommodations/:id" element={<AccommodationDetail />} />
          <Route path="/administracion" element={<AdminLayout />}>
            <Route index element={<Navigate to="lista" replace />} />
            <Route path="lista" element={<AdminList />} />
            <Route path="agregar" element={<AdminCreate />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
