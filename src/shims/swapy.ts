// Origin: agent
/**
 * Minimal stand-in for `swapy` when the package is missing from `node_modules`
 * (e.g. failed `npm install`). Vite resolves `swapy` → this file via `vite.config.ts`.
 * Drag-and-drop reordering is disabled; initial slot order is read once from the DOM.
 */
export function createSwapy(container: HTMLElement, _options?: { animation?: string }) {
  const listeners: Array<() => void> = [];

  const notify = () => {
    listeners.forEach((fn) => fn());
  };

  const observer = new MutationObserver(() => {
    notify();
  });

  observer.observe(container, { childList: true, subtree: true, attributes: true });

  return {
    onSwap(cb: () => void) {
      listeners.push(cb);
    },
    destroy() {
      observer.disconnect();
    },
  };
}
