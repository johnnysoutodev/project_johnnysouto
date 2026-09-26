import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Regressao pro achado do PageSpeed (26/09/2026, auditoria de acessibilidade -
   * "elementos de titulo nao aparecem em ordem sequencial descendente"): a pagina tinha
   * H1 (Hero) seguido direto de H3 (About/itens de Experience/Project), pulando o H2, e
   * 5 secoes (Skills, Experience, Project, Testimonials, Contact me) nao tinham heading
   * nenhum pro titulo - so um `<p>` estilizado. So Home compoe TODAS as secoes juntas,
   * na ordem real da pagina - por isso o teste vive aqui, nao em cada spec de secao.
   */
  it('tem exatamente um H1 e nunca pula nivel de heading (H1 -> H2 -> H3, sem saltos)', () => {
    const headings = Array.from(
      fixture.nativeElement.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    ) as HTMLElement[];
    const levels = headings.map((el) => Number(el.tagName[1]));

    expect(levels.filter((level) => level === 1).length).toBe(1);
    expect(levels[0]).toBe(1);

    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });
});
