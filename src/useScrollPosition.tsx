import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions: Record<string, number> = {};

interface PathConfig {
  attempts: number[];
  priority: string;
}

const pathConfigs: Record<string, PathConfig> = {
  '/ecosystem': {
    attempts: [0, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300],
    priority: 'high'
  },
};

const getPathConfig = (path: string): PathConfig => {
  if (pathConfigs[path]) return pathConfigs[path];
  for (const configPath in pathConfigs) {
    if (path.startsWith(configPath)) {
      return pathConfigs[configPath];
    }
  }
  return {
    attempts: [0, 10, 50, 100],
    priority: 'normal'
  };
};

export default function useScrollPosition(): void {
  const location = useLocation();
  const navigationType = useNavigationType();
  const currentPath = location.pathname;
  
  console.log('useScrollPosition initialized for path:', currentPath);

  useEffect(() => {
    console.log('Setting up scroll listener for path:', currentPath);
    
    const handleScroll = (): void => {
      scrollPositions[currentPath] = window.scrollY;
      console.log('Saving scroll position for path:', currentPath, 'position:', window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPath]);

  useEffect(() => {
    const config = getPathConfig(currentPath);
    
    const attemptScroll = () => {
      console.log('Attempting to restore scroll for:', currentPath, 'Saved position:', scrollPositions[currentPath]);
      if (scrollPositions[currentPath] !== undefined) {
        console.log('Restoring scroll to:', scrollPositions[currentPath]);
        window.scrollTo(0, scrollPositions[currentPath]);
        return true;
      }
      console.log('No saved position found for:', currentPath);
      return false;
    };

    attemptScroll();

    if (config.priority === 'high') {
      console.log('High priority path detected:', currentPath);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          console.log('RAF scroll attempt for high priority path');
          attemptScroll();
        });
      });
    }

    const timeoutIds: number[] = [];

    console.log('Setting up multiple scroll attempts with delays:', config.attempts);
    config.attempts.forEach((delay: number) => {
      const id = window.setTimeout(() => {
        console.log('Timeout scroll attempt at delay:', delay, 'ms');
        attemptScroll();
      }, delay);
      timeoutIds.push(id);
    });

    console.log('Setting up intersection observer');
    const observer = new IntersectionObserver((entries) => {
      console.log('Intersection observed, entries:', entries.length);
      if (entries.some(entry => entry.isIntersecting)) {
        console.log('Content is now visible, attempting scroll restoration');
        attemptScroll();
        observer.disconnect();
      }
    });

    setTimeout(() => {
      try {
        console.log('Looking for content elements to observe');
        const contentElements = document.querySelectorAll('.content-container, main, [role="main"], .app-content');
        console.log('Found content elements:', contentElements.length);
        if (contentElements.length > 0) {
          contentElements.forEach(el => {
            console.log('Observing element:', el.tagName, el.className);
            observer.observe(el);
          });
        } else {
          console.log('No specific content elements found, observing body');
          observer.observe(document.body);
        }
      } catch (e) {
        console.error('Error setting up intersection observer:', e);
      }
    }, 10);

    console.log('Setting up mutation observer');
    const mutationObserver = new MutationObserver((mutations) => {
      console.log('DOM mutation detected, mutations:', mutations.length);
      attemptScroll();
    });

    setTimeout(() => {
      try {
        console.log('Starting mutation observer on body');
        mutationObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class']
        });
        
        setTimeout(() => {
          console.log('Disconnecting mutation observer');
          mutationObserver.disconnect();
        }, 1000);
      } catch (e) {
        console.error('Error setting up mutation observer:', e);
      }
    }, 20);

    return () => {
      console.log('Cleaning up scroll restoration for path:', currentPath);
      console.log('Clearing timeouts:', timeoutIds.length);
      timeoutIds.forEach(id => window.clearTimeout(id));
      console.log('Disconnecting observers');
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [currentPath, navigationType]);
}