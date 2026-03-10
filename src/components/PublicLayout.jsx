import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import PasswordGate from './PasswordGate';

export default function PublicLayout() {
  return (
    <PasswordGate>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </PasswordGate>
  );
}
