/**
 * Fixed decorative background: subtle grid + slow-moving aurora blobs.
 * Purely visual (aria-hidden) and disabled under prefers-reduced-motion via CSS.
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] dark:opacity-40" />
      <div className="absolute -left-24 top-[-10%] h-[28rem] w-[28rem] animate-aurora rounded-full bg-brand-500/15 blur-3xl dark:bg-brand-500/25" />
      <div className="absolute right-[-10%] top-1/4 h-[26rem] w-[26rem] animate-aurora rounded-full bg-accent-cyan/15 blur-3xl dark:bg-accent-cyan/25 [animation-delay:-6s]" />
      <div className="absolute bottom-[-15%] left-1/3 h-[30rem] w-[30rem] animate-aurora rounded-full bg-accent-violet/15 blur-3xl dark:bg-accent-violet/25 [animation-delay:-12s]" />
    </div>
  );
}
