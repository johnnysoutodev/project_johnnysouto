import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Testimonials } from './testimonials';

describe('Testimonials', () => {
  let component: Testimonials;
  let fixture: ComponentFixture<Testimonials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Testimonials],
    }).compileComponents();

    fixture = TestBed.createComponent(Testimonials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets the #testimonials host id for the Header anchor link', () => {
    expect(fixture.nativeElement.id).toBe('testimonials');
  });

  it('renders exactly 3 cards, side by side (not stacked), with clearly fictitious names', () => {
    const cards = fixture.debugElement.queryAll(By.css('.testimonials__card'));
    expect(cards.length).toBe(3);

    const names = cards.map((card) =>
      card.query(By.css('.testimonials__name')).nativeElement.textContent.trim(),
    );
    expect(names).toEqual([
      'Depoimento de exemplo 1',
      'Depoimento de exemplo 2',
      'Depoimento de exemplo 3',
    ]);
  });

  it('shows a visible placeholder note in the heading subtitle, not just a code comment', () => {
    const subtitle = fixture.debugElement.query(By.css('.testimonials__subtitle'));
    expect(subtitle.nativeElement.textContent.toLowerCase()).toContain('exemplo');
  });

  it('renders a generic icon (not a raster photo) inside each solid-colored avatar circle', () => {
    const avatars = fixture.debugElement.queryAll(By.css('.testimonials__avatar'));
    expect(avatars.length).toBe(3);

    for (const avatar of avatars) {
      expect(avatar.query(By.css('img'))).toBeNull();
      expect(avatar.query(By.css('svg'))).toBeTruthy();
    }
  });

  it('renders each card with quote + name + role', () => {
    const firstCard = fixture.debugElement.queryAll(By.css('.testimonials__card'))[0];

    expect(firstCard.query(By.css('.testimonials__quote')).nativeElement.textContent).toContain(
      'depoimento de exemplo',
    );
    expect(firstCard.query(By.css('.testimonials__role')).nativeElement.textContent.trim()).toBe(
      'Cargo e empresa fictícios',
    );
  });
});
