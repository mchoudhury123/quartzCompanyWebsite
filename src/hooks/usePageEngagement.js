import { useEffect } from 'react';
import { trackScroll, trackTimeOnPage } from '../lib/metaTracking';

// Fires scroll-depth (25/50/75/100) and time-on-page (30/60/120s) events once
// each per page. Everything resets when `pathname` changes, and all listeners /
// timers are torn down on navigation so nothing leaks or double-fires.
// Events themselves are consent-gated inside trackEvent().
const SCROLL_MARKS = [25, 50, 75, 100];
const TIME_MARKS = [30, 60, 120];

export default function usePageEngagement(pathname) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (pathname.startsWith('/admin')) return undefined; // customers only

    const firedScroll = new Set();
    let ticking = false;

    const measure = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // Short pages that can't scroll still count as "fully seen".
      const pct =
        scrollable <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / scrollable) * 100));
      for (const mark of SCROLL_MARKS) {
        if (pct >= mark && !firedScroll.has(mark)) {
          firedScroll.add(mark);
          trackScroll(mark);
        }
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(measure);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    measure(); // capture short pages / restored scroll position immediately

    const timers = TIME_MARKS.map((s) => setTimeout(() => trackTimeOnPage(s), s * 1000));

    return () => {
      window.removeEventListener('scroll', onScroll);
      timers.forEach(clearTimeout);
    };
  }, [pathname]);
}
