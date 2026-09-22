import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ContactMe } from './contact-me';

describe('ContactMe', () => {
  let component: ContactMe;
  let fixture: ComponentFixture<ContactMe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactMe],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactMe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (navigator as { clipboard?: unknown }).clipboard;
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the #contact host id for the Header anchor link', () => {
    expect(fixture.nativeElement.id).toBe('contact');
  });

  it('stacks everything in a single centered column (heading, then email, then phone, then social) — no side-by-side layout', () => {
    const container = fixture.debugElement.query(By.css('.contact-me__container'));
    const childClasses = Array.from(container.nativeElement.children as HTMLElement[]).map(
      (el) => el.className,
    );

    expect(childClasses).toEqual([
      'contact-me__heading',
      'contact-me__central',
      'contact-me__social',
    ]);
  });

  it('renders the email as a real mailto: link with the real address and a pre-filled subject', () => {
    const emailLink = fixture.debugElement.query(By.css('.contact-me__row--email a'));
    expect(emailLink.nativeElement.getAttribute('href')).toBe(
      'mailto:johnnyjns@gmail.com?subject=Vamos%20bater%20um%20papo%3F',
    );
    expect(emailLink.nativeElement.textContent.trim()).toBe('johnnyjns@gmail.com');
  });

  it('renders the phone number as a real tel: link, displayed in the readable phone format', () => {
    const phoneLink = fixture.debugElement.query(By.css('.contact-me__row--phone a'));
    expect(phoneLink.nativeElement.getAttribute('href')).toBe('tel:+5511997037799');
    expect(phoneLink.nativeElement.textContent.trim()).toBe('+55 11 99703-7799');
  });

  it('renders GitHub and LinkedIn as icon-only Icon Button links (real hrefs, real icons)', () => {
    const socialLinks = fixture.debugElement.queryAll(By.css('.contact-me__links a.icon-button'));
    expect(socialLinks.length).toBe(2);

    const githubLink = socialLinks[0];
    expect(githubLink.nativeElement.getAttribute('href')).toBe('https://github.com/johnnysoutodev');
    expect(githubLink.nativeElement.getAttribute('target')).toBe('_blank');
    const githubIcon = githubLink.nativeElement.querySelector('img');
    expect(githubIcon.getAttribute('ng-src') ?? githubIcon.src).toContain(
      'icon-social-github.svg',
    );

    const linkedinLink = socialLinks[1];
    expect(linkedinLink.nativeElement.getAttribute('href')).toBe(
      'https://www.linkedin.com/in/johnnysouto',
    );
    expect(linkedinLink.nativeElement.getAttribute('target')).toBe('_blank');
    expect(linkedinLink.nativeElement.querySelector('img')).toBeTruthy();
  });

  it('copies the given value to the clipboard and reverts the "copied" feedback after a few seconds', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    await component['copy']('email', 'johnnyjns@gmail.com');

    expect(writeText).toHaveBeenCalledWith('johnnyjns@gmail.com');
    expect(component['copiedField']()).toBe('email');

    vi.advanceTimersByTime(2000);
    expect(component['copiedField']()).toBeNull();
  });

  it('swaps the copy icon and aria-label on the email row after a real click, via the Clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    const copyButton = fixture.debugElement.query(
      By.css('.contact-me__row--email app-icon-button button'),
    );
    expect(copyButton.nativeElement.getAttribute('aria-label')).toBe('Copiar email');

    copyButton.nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(writeText).toHaveBeenCalledWith('johnnyjns@gmail.com');
    expect(copyButton.nativeElement.getAttribute('aria-label')).toBe('Email copiado!');
  });

  it('does not silently throw when the Clipboard API is unavailable/rejects (e.g. permission denied)', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
      writable: true,
    });

    await expect(component['copy']('phone', '+55 11 99703-7799')).resolves.toBeUndefined();
    expect(component['copiedField']()).toBeNull();
  });
});

describe('ContactMe on the server (SSR/prerender)', () => {
  it('never touches navigator.clipboard when PLATFORM_ID is "server"', async () => {
    await TestBed.configureTestingModule({
      imports: [ContactMe],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();

    const fixture = TestBed.createComponent(ContactMe);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
      writable: true,
    });

    await component['copy']('email', 'johnnyjns@gmail.com');

    expect(writeText).not.toHaveBeenCalled();
    expect(component['copiedField']()).toBeNull();

    delete (navigator as { clipboard?: unknown }).clipboard;
  });
});
