import useInView from '../hooks/useInView';

export default function Highlight({ children, className = '' }) {
    const { elementRef, isInView } = useInView();

    return (
        <span
            className={`relative z-0 box-decoration-clone whitespace-nowrap transition-colors after:absolute after:top-[8%] after:right-[-3%] after:bottom-[4%] after:left-[-3%] after:-z-10 after:origin-left after:-skew-x-6 after:rounded-sm after:bg-marker after:transition-transform after:duration-700 after:ease-[cubic-bezier(.7,0,.2,1)] rtl:leading-[1.4] rtl:after:origin-right max-[900px]:whitespace-normal max-[900px]:px-1 max-[900px]:after:hidden ${
                isInView
                    ? 'text-marker-ink after:scale-x-100 max-[900px]:bg-marker'
                    : 'text-foreground after:scale-x-0'
            } ${className}`}
            ref={elementRef}
        >
            {children}
        </span>
    );
}
