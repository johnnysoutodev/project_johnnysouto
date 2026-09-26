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

  it('renders exactly 4 real cards, side by side (not stacked), in the right order', () => {
    const cards = fixture.debugElement.queryAll(By.css('.testimonials__card'));
    expect(cards.length).toBe(4);

    const names = cards.map((card) =>
      card.query(By.css('.testimonials__name')).nativeElement.textContent.trim(),
    );
    expect(names).toEqual([
      'Alexandre Franco',
      'Raphaela Simon',
      'Cesar Sales Lima',
      'Marion Almeida',
    ]);
  });

  it('renders each real photo inside the avatar circle (not the generic icon)', () => {
    const avatars = fixture.debugElement.queryAll(By.css('.testimonials__avatar'));
    expect(avatars.length).toBe(4);

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
    ).toContain('profile_testmonial_02.jpg');
    expect(raphaelPhoto.nativeElement.getAttribute('alt')).toBe('Raphaela Simon');

    const cesarPhoto = avatars[2].query(By.css('img'));
    expect(avatars[2].query(By.css('svg'))).toBeNull();
    expect(
      cesarPhoto.nativeElement.getAttribute('ng-src') ?? cesarPhoto.nativeElement.src,
    ).toContain('profile_testmonial_03.jpeg');
    expect(cesarPhoto.nativeElement.getAttribute('alt')).toBe('Cesar Sales Lima');

    const marionPhoto = avatars[3].query(By.css('img'));
    expect(avatars[3].query(By.css('svg'))).toBeNull();
    expect(
      marionPhoto.nativeElement.getAttribute('ng-src') ?? marionPhoto.nativeElement.src,
    ).toContain('profile_testmonial_04.jpeg');
    expect(marionPhoto.nativeElement.getAttribute('alt')).toBe('Marion Almeida');
  });

  it('renders each card with quote + name + role', () => {
    const cards = fixture.debugElement.queryAll(By.css('.testimonials__card'));

    expect(cards[0].query(By.css('.testimonials__quote')).nativeElement.textContent).toContain(
      'Excelente profissional',
    );
    expect(cards[0].query(By.css('.testimonials__role')).nativeElement.textContent.trim()).toBe(
      'DBA na Capgemini',
    );

    expect(cards[1].query(By.css('.testimonials__role')).nativeElement.textContent.trim()).toBe(
      'Líder na TOTVS',
    );

    expect(cards[2].query(By.css('.testimonials__quote')).nativeElement.textContent).toContain(
      'Além da competência profissional',
    );
    expect(cards[2].query(By.css('.testimonials__role')).nativeElement.textContent.trim()).toBe(
      'Especialista em Observabilidade na IBM',
    );

    expect(cards[3].query(By.css('.testimonials__quote')).nativeElement.textContent).toContain(
      'Tive o prazer de trabalhar com o Johnny',
    );
    expect(cards[3].query(By.css('.testimonials__role')).nativeElement.textContent.trim()).toBe(
      'Supervisor na Nielsen',
    );
  });
});
