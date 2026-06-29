import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { trackPageView } from './lib/metaTracking';
import { initClickTracking } from './lib/interactionTracking';
import usePageEngagement from './hooks/usePageEngagement';
import CookieConsent from './components/CookieConsent';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './admin/components/AdminLayout';
import ProtectedRoute from './admin/components/ProtectedRoute';

import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import ProductDetailPage from './pages/ProductDetailPage';
import MaterialPage from './pages/MaterialPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CareersPage from './pages/CareersPage';
import MeasuringGuidePage from './pages/MeasuringGuidePage';
import DesignOptionsPage from './pages/DesignOptionsPage';
import InspirationPage from './pages/InspirationPage';
import HowToBuyPage from './pages/HowToBuyPage';
import WarrantyPage from './pages/WarrantyPage';
import SalePage from './pages/SalePage';
import QuotePage from './pages/QuotePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import NotFoundPage from './pages/NotFoundPage';

import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminDashboard from './admin/pages/AdminDashboard';
import LeadsListPage from './admin/pages/LeadsListPage';
import LeadDetailPage from './admin/pages/LeadDetailPage';
import QuoteBuilderPage from './admin/pages/QuoteBuilderPage';
import SamplesPage from './admin/pages/SamplesPage';
import AppointmentsPage from './admin/pages/AppointmentsPage';
import TradeContactsPage from './admin/pages/TradeContactsPage';
import ReviewsPage from './admin/pages/ReviewsPage';
import QuoteViewPage from './pages/QuoteViewPage';
import ReviewPage from './pages/ReviewPage';

// Drives all site-wide Meta tracking: PageView on every route, scroll-depth and
// time-on-page engagement, and a single delegated click listener for Contact /
// CTA / InitiateCheckout. Every event is consent-gated inside trackEvent().
function MetaPixelTracker() {
  const location = useLocation();

  // PageView on first load + every navigation. index.html no longer fires
  // PageView, so this is the single source of PageViews (each with an event_id
  // for browser↔server deduplication).
  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  // Scroll-depth + time-on-page, reset per page.
  usePageEngagement(location.pathname);

  // One delegated click listener for Contact / CTA / InitiateCheckout.
  useEffect(() => initClickTracking(), []);

  return null;
}

export default function App() {
  return (
    <>
      <MetaPixelTracker />
      <CookieConsent />
      <Routes>
      {/* Public quote view + review (standalone, no layout wrapper) */}
      <Route path="/quote/view/:quoteId" element={<QuoteViewPage />} />
      <Route path="/review/:quoteId" element={<ReviewPage />} />

      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/colours" element={<CataloguePage />} />
        <Route path="/colours/:category" element={<CataloguePage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/materials/:type" element={<MaterialPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/measuring-guide" element={<MeasuringGuidePage />} />
        <Route path="/design-options" element={<DesignOptionsPage />} />
        <Route path="/inspiration" element={<InspirationPage />} />
        <Route path="/how-to-buy" element={<HowToBuyPage />} />
        <Route path="/warranty" element={<WarrantyPage />} />
        <Route path="/sale" element={<SalePage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin CRM */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<LeadsListPage />} />
          <Route path="leads/:id" element={<LeadDetailPage />} />
          <Route path="leads/:id/quote/new" element={<QuoteBuilderPage />} />
          <Route path="leads/:id/quote/:quoteId" element={<QuoteBuilderPage />} />
          <Route path="samples" element={<SamplesPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="trade-contacts" element={<TradeContactsPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
        </Route>
      </Route>
    </Routes>
    </>
  );
}
