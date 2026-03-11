import { useState, useEffect } from 'react';

export default function useZohoUnread(pollInterval = 60000) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/zoho-unread');
        const data = await res.json();
        if (mounted && typeof data.unread === 'number') {
          setUnread(data.unread);
        }
      } catch {
        // silently fail — badge just won't show
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, pollInterval);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pollInterval]);

  return unread;
}
