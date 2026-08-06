import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import SaleCountdownPopup from './SaleCountdownPopup';
import { SaleProvider } from './SaleProvider';

export default function PublicLayout() {
  return (
    <SaleProvider>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <SaleCountdownPopup />
    </SaleProvider>
  );
}
