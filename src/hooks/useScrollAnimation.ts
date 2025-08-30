"use client";

import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  reverseOnExit?: boolean;
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(options: ScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<T>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = false,
    delay = 0,
    reverseOnExit = true
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            if (triggerOnce) setHasAnimated(true);
          }
        } else if (reverseOnExit) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated, reverseOnExit]);

  return { elementRef, isVisible, hasAnimated };
}

export function useStaggeredAnimations(count: number, staggerDelay: number = 300) {
  const [visibleStates, setVisibleStates] = useState<boolean[]>(() => new Array(count).fill(false));
  const refs = useRef<(HTMLElement | null)[]>(new Array(count).fill(null));

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleStates(prev => {
                const newStates = [...prev];
                newStates[index] = true;
                return newStates;
              });
            }, index * staggerDelay);
          } else {
            // Reverse animation when scrolling back
            setTimeout(() => {
              setVisibleStates(prev => {
                const newStates = [...prev];
                newStates[index] = false;
                return newStates;
              });
            }, index * staggerDelay);
          }
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -100px 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [count, staggerDelay]);

  const getRef = (index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el;
  };

  return { getRef, visibleStates };
}
