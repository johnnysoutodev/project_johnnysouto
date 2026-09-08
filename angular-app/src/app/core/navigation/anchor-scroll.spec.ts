import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnchorScrollService } from './anchor-scroll';

describe('AnchorScrollService', () => {
  let service: AnchorScrollService;
  let animationFrames: FrameRequestCallback[];
  let target: HTMLElement;

  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false }) as MediaQueryList),
    );
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnchorScrollService);
    animationFrames = [];

    target = document.createElement('section');
    target.id = 'work';
    document.body.appendChild(target);

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({ top: 400 } as DOMRect);
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(100);
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    vi.spyOn(performance, 'now').mockReturnValue(1000);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    target.remove();
    history.replaceState(null, '', location.pathname);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('anima ate a ancora em 650ms e atualiza o hash', () => {
    const event = new MouseEvent('click', { button: 0, cancelable: true });

    service.scroll(event, '#work');

    expect(event.defaultPrevented).toBe(true);
    expect(location.hash).toBe('#work');
    expect(animationFrames).toHaveLength(1);

    animationFrames.shift()!(1325);
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 450);

    animationFrames.shift()!(1650);
    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 500);
    expect(animationFrames).toHaveLength(0);
  });

  it('rola imediatamente quando o usuario prefere movimento reduzido', () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    const event = new MouseEvent('click', { button: 0, cancelable: true });

    service.scroll(event, '#work');

    expect(window.scrollTo).toHaveBeenCalledWith(0, 500);
    expect(animationFrames).toHaveLength(0);
  });

  it('preserva o comportamento nativo em cliques modificados', () => {
    const event = new MouseEvent('click', { button: 0, metaKey: true, cancelable: true });

    service.scroll(event, '#work');

    expect(event.defaultPrevented).toBe(false);
    expect(animationFrames).toHaveLength(0);
  });
});

describe('AnchorScrollService - SSR', () => {
  it('nao acessa o DOM na plataforma servidor', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const service = TestBed.inject(AnchorScrollService);
    const event = new MouseEvent('click', { button: 0, cancelable: true });

    expect(() => service.scroll(event, '#work')).not.toThrow();
    expect(event.defaultPrevented).toBe(false);
  });
});
