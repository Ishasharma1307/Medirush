import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Importing pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Medicines } from './pages/Medicines';
import { MedicineDetail } from './pages/MedicineDetail';
import { HomeRemedies } from './pages/HomeRemedies';
import { NearbyHealthcare } from './pages/NearbyHealthcare';
import { SymptomChecker } from './pages/SymptomChecker';
import { EmergencyRequest } from './pages/EmergencyRequest';
import { Orders } from './pages/Orders';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { PrescriptionUpload } from './pages/PrescriptionUpload';
import { MedicineReminder } from './pages/MedicineReminder';
import { MedicalReportSimplifier } from './pages/MedicalReportSimplifier';
import { RecentMedicines } from './pages/RecentMedicines';
import { PharmacyDirectory } from './pages/PharmacyDirectory';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { OrderTracking } from './pages/OrderTracking';
import { AuthCallback } from './pages/AuthCallback';
import { ForgotPassword } from './pages/ForgotPassword';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Routes without Navbar layout */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin" element={<Admin />} />

          {/* Main App Routes wrapped in the Layout (Navbar) */}
          <Route element={<Layout />}>
            {/* Protected Routes inside Layout */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/medicines" element={<Medicines />} />
              <Route path="/medicines/:id" element={<MedicineDetail />} />
              <Route path="/home-remedies" element={<HomeRemedies />} />
              <Route path="/nearby" element={<NearbyHealthcare />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/emergency-request" element={<EmergencyRequest />} />
              <Route path="/prescription-upload" element={<PrescriptionUpload />} />
              <Route path="/medicine-reminder" element={<MedicineReminder />} />
              <Route path="/report-simplifier" element={<MedicalReportSimplifier />} />
              <Route path="/recent-medicines" element={<RecentMedicines />} />
              <Route path="/pharmacies" element={<PharmacyDirectory />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/track-order/:id" element={<OrderTracking />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
