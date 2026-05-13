/** Minimal typings for the real `swapy` package (optional when using shim). */
declare module 'swapy' {
  export function createSwapy(
    container: HTMLElement,
    options?: { animation?: string }
  ): {
    onSwap(callback: () => void): void;
    destroy(): void;
  };
}
