import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import ProductDetailPage from './pages/ProductDetailPage';
import MaterialPage from './pages/MaterialPage';
import InspirationPage from './pages/InspirationPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ShowroomsPage from './pages/ShowroomsPage';
import CareersPage from './pages/CareersPage';
import MeasuringGuidePage from './pages/MeasuringGuidePage';
import DesignOptionsPage from './pages/DesignOptionsPage';
import HowToBuyPage from './pages/HowToBuyPage';
import InstallationCoveragePage from './pages/InstallationCoveragePage';
import WarrantyPage from './pages/WarrantyPage';
import FinancePage from './pages/FinancePage';
import SalePage from './pages/SalePage';
import QuotePage from './pages/QuotePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/colours" element={<CataloguePage />} />
          <Route path="/colours/:category" element={<CataloguePage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/materials/:type" element={<MaterialPage />} />
          <Route path="/inspiration" element={<InspirationPage />} />
          <Route path="/inspiration/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/showrooms" element={<ShowroomsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/measuring-guide" element={<MeasuringGuidePage />} />
          <Route path="/design-options" element={<DesignOptionsPage />} />
          <Route path="/how-to-buy" element={<HowToBuyPage />} />
          <Route path="/installation-coverage" element={<InstallationCoveragePage />} />
          <Route path="/warranty" element={<WarrantyPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/sale" element={<SalePage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
