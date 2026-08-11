import useInView from '../hooks/useInView';

export default function Reveal({
    as: Component = 'div',
    children,
    className = '',
    delay = 0,
    threshold = 0.25,
    ...props
}) {
    const { elementRef, isInView } = useInView({ threshold });

    return (
        <Component
            {...props}
            className={`transition-[opacity,transform] duration-[600ms] ease-out motion-reduce:transition-none ${
                isInView
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-[18px] opacity-0'
            } ${className}`}
            ref={elementRef}
            style={{ transitionDelay: isInView ? `${delay}ms` : '0ms' }}
        >
            {children}
        </Component>
    );
}
