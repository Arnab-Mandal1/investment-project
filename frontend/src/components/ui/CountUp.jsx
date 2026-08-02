import { useState, useEffect, useRef } from 'react';

const CountUp = ({ end, duration = 1500, prefix = '', suffix = '', decimals = 0 }) => {
    const [count, setCount] = useState(0);
    const frameRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        if (end === 0 || end === null || end === undefined) {
            setCount(0);
            return;
        }

        const animate = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

            // Ease out cubic — fast start, slow finish
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * end);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [end, duration]);

    const formatted = count.toFixed(decimals);

    return (
        <span>
      {prefix}{formatted}{suffix}
    </span>
    );
};

export default CountUp;