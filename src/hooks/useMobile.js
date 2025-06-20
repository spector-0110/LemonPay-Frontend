'use client';

import { useState, useEffect } from 'react';

// Custom hook for mobile detection and responsive behavior
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const checkDevice = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Define breakpoints
        const mobile = width < 768;
        const tablet = width >= 768 && width < 1024;
        const desktop = width >= 1024;
        
        setIsMobile(mobile);
        setIsTablet(tablet);
        
        if (mobile) setScreenSize('mobile');
        else if (tablet) setScreenSize('tablet');
        else setScreenSize('desktop');
        
        setOrientation(height > width ? 'portrait' : 'landscape');
      }
    };

    // Initial check
    checkDevice();

    // Add event listeners
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: screenSize === 'desktop',
    screenSize,
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape'
  };
}

// Custom hook for touch interactions
export function useTouch() {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    return {
      isLeftSwipe,
      isRightSwipe,
      distance: Math.abs(distance)
    };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    touchStart,
    touchEnd
  };
}

// Custom hook for mobile-friendly animations
export function useMobileAnimation() {
  const { isMobile } = useMobile();
  
  const getVariants = (type = 'default') => {
    const baseVariants = {
      default: {
        initial: { opacity: 0, y: isMobile ? 10 : 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: isMobile ? -10 : -20 },
        transition: { duration: isMobile ? 0.2 : 0.3 }
      },
      slide: {
        initial: { opacity: 0, x: isMobile ? 20 : 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: isMobile ? -20 : -40 },
        transition: { duration: isMobile ? 0.25 : 0.4 }
      },
      scale: {
        initial: { opacity: 0, scale: isMobile ? 0.95 : 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: isMobile ? 0.95 : 0.9 },
        transition: { duration: isMobile ? 0.2 : 0.3 }
      }
    };
    
    return baseVariants[type] || baseVariants.default;
  };

  const getHoverProps = (enabled = true) => {
    if (!enabled || isMobile) return {};
    
    return {
      whileHover: { scale: 1.02, y: -2 },
      whileTap: { scale: 0.98 }
    };
  };

  return {
    getVariants,
    getHoverProps,
    shouldReduceMotion: isMobile
  };
}

// Custom hook for mobile viewport handling
export function useViewport() {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0,
    safeAreaTop: 0,
    safeAreaBottom: 0
  });

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window !== 'undefined') {
        // Get actual viewport dimensions
        const visualViewport = window.visualViewport || window;
        
        setViewport({
          width: visualViewport.width || window.innerWidth,
          height: visualViewport.height || window.innerHeight,
          safeAreaTop: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0,
          safeAreaBottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0
        });
      }
    };

    updateViewport();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
      return () => window.visualViewport.removeEventListener('resize', updateViewport);
    } else {
      window.addEventListener('resize', updateViewport);
      return () => window.removeEventListener('resize', updateViewport);
    }
  }, []);

  return viewport;
}
