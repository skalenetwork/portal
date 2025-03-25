import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const scrollPositions: Record<string, number> = {};

// Define type for path configuration
interface PathConfig {
  attempts: number[];
  priority: string;
}

// Define type for pathConfigs
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
  
  useEffect(() => {
    const handleScroll = (): void => {
      scrollPositions[currentPath] = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentPath]);
  
  useEffect(() => {
    const config = getPathConfig(currentPath);
    
    const attemptScroll = () => {
      if (scrollPositions[currentPath] !== undefined) {
        window.scrollTo(0, scrollPositions[currentPath]);
        return true;
      }
      return false;
    };
    
    attemptScroll();
    
    if (config.priority === 'high') {
      requestAnimationFrame(() => {
        requestAnimationFrame(attemptScroll);
      });
    }
    
    const timeoutIds: NodeJS.Timeout[] = [];
    
    config.attempts.forEach((delay: number) => {
      const id = setTimeout(attemptScroll, delay);
      timeoutIds.push(id);
    });
    
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        attemptScroll();
        observer.disconnect();
      }
    });
    
    setTimeout(() => {
      try {
        const contentElements = document.querySelectorAll('.content-container, main, [role="main"], .app-content');
        if (contentElements.length > 0) {
          contentElements.forEach(el => observer.observe(el));
        } else {
          observer.observe(document.body);
        }
      } catch (e) {
      }
    }, 10);
    
    const mutationObserver = new MutationObserver(() => {
      attemptScroll();
    });
    
    setTimeout(() => {
      try {
        mutationObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class']
        });
        setTimeout(() => {
          mutationObserver.disconnect();
        }, 1000);
      } catch (e) {
      }
    }, 20);
    
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [currentPath, navigationType]);
}