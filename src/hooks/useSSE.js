import { useEffect } from 'react';

const useSSE = (onMessage, options = {}) => {
  useEffect(() => {
    const url = 'https://api-modasync.xilyor.com/api/events'; // 🔒 Hardcoded SSE URL
    const eventSource = new EventSource(url, options);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.warn('Invalid SSE message:', event.data);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      eventSource.close(); // Optional: stop listening on error
    };

    return () => {
      eventSource.close(); // Cleanup on unmount
    };
  }, [onMessage]);
};

export default useSSE;
