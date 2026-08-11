import { useEffect, useRef, useState } from 'react';

export default function useInView({
    rootMargin = '0px',
    threshold = 0.25,
    once = true,
} = {}) {
    const elementRef = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const element = elementRef.current;

        if (!element) {
            return undefined;
        }

        if (
            !('IntersectionObserver' in window) ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            setIsInView(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);

                if (entry.isIntersecting && once) {
                    observer.unobserve(element);
                }
            },
            { rootMargin, threshold },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [once, rootMargin, threshold]);

    return { elementRef, isInView };
}
