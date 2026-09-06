import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { About } from './about';
import { calculateExperienceYears } from '../hero/hero';

describe('About', () => {
  let component: About;
  let fixture: ComponentFixture<About>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [About],
    }).compileComponents();

    fixture = TestBed.createComponent(About);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the "about" id on the host element for the #about anchor from the Header nav', () => {
    expect(fixture.nativeElement.id).toBe('about');
  });

  it('computes experienceYears with the same shared function/base year as the Hero', () => {
    expect(component['experienceYears']).toBe(calculateExperienceYears(new Date().getFullYear()));
  });

  it('renders the calculated experience years inside the bio', () => {
    const bio = fixture.debugElement.query(By.css('.about__bio'));
    expect(bio.nativeElement.textContent).toContain(String(component['experienceYears']));
  });

  it('renders exactly 2 checklist columns with 2 real, verifiable quick bits each (no invented data)', () => {
    const columns = fixture.debugElement.queryAll(By.css('.about__checklist-column'));
    expect(columns.length).toBe(2);

    const allItemsText = columns
      .map((column) => Array.from<HTMLLIElement>(column.nativeElement.querySelectorAll('li')))
      .flat();
    expect(allItemsText.length).toBe(4);

    const fullText = fixture.nativeElement.textContent as string;
    expect(fullText).toContain(String(component['experienceYears']));
    expect(fullText).toContain('Gestão da Tecnologia da Informação');
    expect(fullText).toContain('Uninove');
    expect(fullText).toContain('Inglês intermediário');
    expect(fullText).toContain('Casado e pai de um filho');
  });

  it('renders a neutral placeholder photo (no <img>), same treatment as the Hero (no real photo available)', () => {
    expect(fixture.debugElement.query(By.css('img'))).toBeNull();

    const initials = fixture.debugElement.query(By.css('.about__pic-initials'));
    expect(initials.nativeElement.textContent.trim()).toBe('JS');
  });

  it('renders the "About me" tag', () => {
    const tag = fixture.debugElement.query(By.css('app-tag'));
    expect(tag.nativeElement.textContent.trim()).toBe('About me');
  });
});
