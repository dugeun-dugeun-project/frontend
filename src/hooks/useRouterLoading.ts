import Router from 'next/router';
import { useEffect, useState } from 'react';

export const useLoading = () => {
  const [nowLoading, setNowLoading] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const start = () => {
      timer = setTimeout(() => {
        setNowLoading(true);
      }, 500);
    };
    const end = () => {
      clearTimeout(timer);
      setNowLoading(false);
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return { nowLoading };
};
