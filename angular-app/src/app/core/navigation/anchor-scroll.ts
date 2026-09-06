import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

const SCROLL_DURATION_MS = 650;

@Injectable({ providedIn: 'root' })
export class AnchorScrollService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private animationFrameId: number | null = null;

  scroll(event: MouseEvent, href: string): void {
    if (!this.isBrowser || !this.shouldHandleClick(event, href)) {
      return;
    }

    const target = document.getElementById(href.slice(1));
    if (!target) {
      return;
    }

    event.preventDefault();
    this.cancelCurrentAnimation();

    const start = window.scrollY;
    const destination = target.getBoundingClientRect().top + start;
    const distance = destination - start;

    history.pushState(null, '', href);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, destination);
      return;
    }

    const startedAt = performance.now();

    const animate = (now: number): void => {
      const progress = Math.min((now - startedAt) / SCROLL_DURATION_MS, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      window.scrollTo(0, start + distance * easedProgress);

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.animationFrameId = null;
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  private shouldHandleClick(event: MouseEvent, href: string): boolean {
    return (
      href.startsWith('#') &&
      href.length > 1 &&
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    );
  }

  private cancelCurrentAnimation(): void {
    if (this.animationFrameId === null) {
      return;
    }

    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }
}
