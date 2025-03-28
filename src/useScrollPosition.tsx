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
  return pathConfigs[path] || { attempts: [0, 10, 50, 100], priority: 'normal' };
};

export default function useScrollPosition() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.set(currentPath, window.scrollY);
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

    const attemptScroll = () => {
      if (savedPosition !== undefined) {
        window.scrollTo({ top: savedPosition, behavior: 'instant' });
        return true;
      }
      return false;
    };

    if (config.priority === 'high') {
      requestAnimationFrame(() => requestAnimationFrame(attemptScroll));
    }

    const scheduleAttempts = () => {
      attemptsLeft.forEach((delay) => {
        setTimeout(() => {
          attemptScroll();
        }, delay);
      });
    };
    scheduleAttempts();

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        attemptScroll();
        observer.disconnect();
      }
    });

    setTimeout(() => {
      document.querySelectorAll('.content-container, main, [role="main"], .app-content').forEach((el) => {
        observer.observe(el);
      });
    }, 10);

    const mutationObserver = new MutationObserver(() => {
      attemptScroll();
    });

    setTimeout(() => {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
      setTimeout(() => mutationObserver.disconnect(), 1000);
    }, 20);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [currentPath, navigationType]);
}
