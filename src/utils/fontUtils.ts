/**
 * Font Utilities for Shrikhand Font
 * Provides utilities to check font availability and fallback handling
 */

import React from 'react';

export class FontChecker {
  /**
   * Check if Shrikhand font is loaded and available
   */
  static async isShrikhandLoaded(): Promise<boolean> {
    if (!document.fonts) {
      return false;
    }

    try {
      const fontFace = new FontFace('Shrikhand', 'url(https://fonts.gstatic.com/s/shrikhand/v15/a8IbNovtLWfR7T7bMJwbBIiQ0zhMtA.woff2)');
      await fontFace.load();
      document.fonts.add(fontFace);
      return document.fonts.check('1em Shrikhand');
    } catch (error) {
      console.warn('Shrikhand font loading failed:', error);
      return false;
    }
  }

  /**
   * Ensure font is loaded before applying to elements
   */
  static async ensureShrikhandLoaded(callback?: () => void): Promise<void> {
    if (!document.fonts) {
      callback?.();
      return;
    }

    try {
      await document.fonts.ready;
      
      // Double-check if Shrikhand is specifically loaded
      const isLoaded = document.fonts.check('1em Shrikhand');
      
      if (!isLoaded) {
        // Trigger font load
        const testElement = document.createElement('div');
        testElement.style.fontFamily = 'Shrikhand';
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        testElement.textContent = 'Font test';
        document.body.appendChild(testElement);
        
        // Wait a bit for font to load
        setTimeout(() => {
          document.body.removeChild(testElement);
          callback?.();
        }, 100);
      } else {
        callback?.();
      }
    } catch (error) {
      console.warn('Font loading check failed:', error);
      callback?.();
    }
  }

  /**
   * Apply Shrikhand font to elements with fallback
   */
  static applyShrikhandToElements(selector: string): void {
    const elements = document.querySelectorAll(selector);
    const fontStack = "'Shrikhand', cursive, 'Comic Sans MS', 'Trebuchet MS', fantasy, sans-serif";
    
    elements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.fontFamily = fontStack;
      }
    });
  }

  /**
   * Create a font loading promise for better control
   */
  static loadShrikhandFont(): Promise<FontFace> {
    return new Promise((resolve, reject) => {
      if (!('FontFace' in window)) {
        reject(new Error('FontFace API not supported'));
        return;
      }

      const fontFace = new FontFace(
        'Shrikhand',
        'url(https://fonts.gstatic.com/s/shrikhand/v15/a8IbNovtLWfR7T7bMJwbBIiQ0zhMtA.woff2) format("woff2"), url(https://fonts.gstatic.com/s/shrikhand/v15/a8IbNovtLWfR7T7bMJwbBIiQ0zhMtA.woff) format("woff")',
        {
          style: 'normal',
          weight: '400',
          display: 'swap'
        }
      );

      fontFace.load()
        .then(() => {
          document.fonts.add(fontFace);
          resolve(fontFace);
        })
        .catch(reject);
    });
  }
}

/**
 * React hook for Shrikhand font loading
 */
export function useShrikhandFont() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;

    const loadFont = async () => {
      try {
        setIsLoading(true);
        await FontChecker.loadShrikhandFont();
        
        if (mounted) {
          setIsLoaded(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Font loading failed');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadFont();

    return () => {
      mounted = false;
    };
  }, []);

  return { isLoaded, isLoading, error };
}

/**
 * CSS-in-JS Shrikhand font styles
 */
const baseShrikhandStyle = {
  fontFamily: "'Shrikhand', cursive, 'Comic Sans MS', 'Trebuchet MS', fantasy, sans-serif",
  fontWeight: 400,
};

export const shrikhandStyles = {
  base: baseShrikhandStyle,
  
  title: {
    ...baseShrikhandStyle,
    letterSpacing: '0.02em',
  },
  
  display: {
    ...baseShrikhandStyle,
    letterSpacing: '0.05em',
  },
  
  responsive: {
    ...baseShrikhandStyle,
    fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
  }
};

// Export default font stack for easy use
export const SHRIKHAND_FONT_STACK = "'Shrikhand', cursive, 'Comic Sans MS', 'Trebuchet MS', fantasy, sans-serif";
