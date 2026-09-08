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

  it('renders exactly 2 real cards, side by side (not stacked), in the right order', () => {
    const cards = fixture.debugElement.queryAll(By.css('.testimonials__card'));
    expect(cards.length).toBe(2);

    const names = cards.map((card) =>
      card.query(By.css('.testimonials__name')).nativeElement.textContent.trim(),
    );
    expect(names).toEqual(['Alexandre Franco', 'Raphaela Simon']);
  });

  it('renders each real photo inside the avatar circle (not the generic icon)', () => {
    const avatars = fixture.debugElement.queryAll(By.css('.testimonials__avatar'));
    expect(avatars.length).toBe(2);

    const alexandrePhoto = avatars[0].query(By.css('img'));
    expect(avatars[0].query(By.css('svg'))).toBeNull();
    expect(
      alexandrePhoto.nativeElement.getAttribute('ng-src') ?? alexandrePhoto.nativeElement.src,
    ).toContain('profile_testmonial_01.jpeg');
    expect(alexandrePhoto.nativeElement.getAttribute('alt')).toBe('Alexandre Franco');

    const raphaelPhoto = avatars[1].query(By.css('img'));
    expect(avatars[1].query(By.css('svg'))).toBeNull();
    expect(
      raphaelPhoto.nativeElement.getAttribute('ng-src') ?? raphaelPhoto.nativeElement.src,
    ).toContain('profile_testmonial_02.png');
    expect(raphaelPhoto.nativeElement.getAttribute('alt')).toBe('Raphaela Simon');
  });

  it('renders each card with quote + name + role', () => {
    const cards = fixture.debugElement.queryAll(By.css('.testimonials__card'));

    expect(cards[0].query(By.css('.testimonials__quote')).nativeElement.textContent).toContain(
      'Excelente profissional',
    );
    expect(cards[0].query(By.css('.testimonials__role')).nativeElement.textContent.trim()).toBe(
      'DBA da Capgemini',
    );

    expect(cards[1].query(By.css('.testimonials__role')).nativeElement.textContent.trim()).toBe(
      'Coordenadora da Totvs',
    );
  });
});
