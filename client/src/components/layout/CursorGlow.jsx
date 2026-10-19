import { useEffect, useRef } from 'react';

/**
 * A soft light that follows the pointer. Only enabled on fine-pointer devices
 * and when the visitor has not requested reduced motion.
 */
export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = `translate3d(calc(${e.clientX}px - 18rem), calc(${e.clientY}px - 18rem), 0)`;
      });
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[36rem] w-[36rem] opacity-0 transition-opacity duration-500 will-change-transform"
      style={{
        background:
          'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(34,211,238,0.08) 35%, transparent 70%)',
      }}
    />
  );
}
