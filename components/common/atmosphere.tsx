"use client";

/**
 * Cinematic ambient layer — flowing ember light (not stars / not galaxy).
 */
export function Atmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="atmosphere-base absolute inset-0" />
      <div className="atmosphere-ribbon atmosphere-ribbon-a absolute -left-1/4 top-[8%] h-[42vh] w-[90vw] opacity-70" />
      <div className="atmosphere-ribbon atmosphere-ribbon-b absolute -right-1/5 top-[38%] h-[36vh] w-[80vw] opacity-55" />
      <div className="atmosphere-ribbon atmosphere-ribbon-c absolute left-[10%] bottom-[6%] h-[28vh] w-[70vw] opacity-45" />
      <div className="atmosphere-grain absolute inset-0" />
      <div className="atmosphere-vignette absolute inset-0" />
    </div>
  );
}
