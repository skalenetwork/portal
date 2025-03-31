import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions = new Map<string, number>();

type PathConfig = {
  attempts: number[];
  priority: string;
};

const pathConfigs: Record<string, PathConfig> = {
  '/ecosystem': {
    attempts: [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300],
    priority: 'high',
  },
};

const getPathConfig = (path: string): PathConfig => {
  console.log('Fetching path config for:', path);
  return pathConfigs[path] || { attempts: [0, 10, 50, 100], priority: 'normal' };
};

export default function useScrollPosition() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const currentPath = location.pathname;

  console.log('Initializing useScrollPosition for path:', currentPath);

  useEffect(() => {
    console.log('Setting up scroll listener for path:', currentPath);
    const handleScroll = () => {
      scrollPositions.set(currentPath, window.scrollY);
      console.log('Saving scroll position for path:', currentPath, 'position:', window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPath]);

  useEffect(() => {
    const config = getPathConfig(currentPath);
    let attemptsLeft = [...config.attempts];
    const savedPosition = scrollPositions.get(currentPath);

    console.log('Attempting to restore scroll for:', currentPath, 'Saved position:', savedPosition);

    const attemptScroll = () => {
      if (savedPosition !== undefined) {
        console.log('Restoring scroll to:', savedPosition);
        window.scrollTo({ top: savedPosition, behavior: 'instant' });
        return true;
      }
      console.log('No saved position found for:', currentPath);
      return false;
    };

    if (config.priority === 'high') {
      console.log('High priority path detected:', currentPath);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        console.log('RAF scroll attempt for high priority path');
        attemptScroll();
      }));
    }

    console.log('Setting up multiple scroll attempts with delays:', config.attempts);
    const scheduleAttempts = () => {
      attemptsLeft.forEach((delay) => {
        setTimeout(() => {
          console.log('Timeout scroll attempt at delay:', delay, 'ms');
          attemptScroll();
        }, delay);
      });
    };
    scheduleAttempts();

    console.log('Setting up intersection observer');
    const observer = new IntersectionObserver((entries) => {
      console.log('Intersection observed, entries:', entries.length);
      if (entries.some((entry) => entry.isIntersecting)) {
        console.log('Content is now visible, attempting scroll restoration');
        attemptScroll();
        observer.disconnect();
      }
    });

    setTimeout(() => {
      console.log('Looking for content elements to observe');
      document.querySelectorAll('.content-container, main, [role="main"], .app-content').forEach((el) => {
        console.log('Observing element:', el.tagName, el.className);
        observer.observe(el);
      });
    }, 10);

    console.log('Setting up mutation observer');
    const mutationObserver = new MutationObserver(() => {
      console.log('DOM mutation detected, attempting scroll restoration');
      attemptScroll();
    });

    setTimeout(() => {
      console.log('Starting mutation observer on body');
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
      setTimeout(() => {
        console.log('Disconnecting mutation observer');
        mutationObserver.disconnect();
      }, 1000);
    }, 20);

    return () => {
      console.log('Cleaning up scroll restoration for path:', currentPath);
      console.log('Disconnecting observers');
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [currentPath, navigationType]);
}
