import { DeferBlockState } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

  it('renders app-hero fora de qualquer @defer (é a imagem LCP, precisa ficar imediata)', () => {
    expect(fixture.debugElement.query(By.css('app-hero'))).not.toBeNull();
  });

  /**
   * As 6 seções abaixo da dobra (about, skills, experience, project, testimonials,
   * contact-me) usam `@defer (hydrate on viewport)` (26/09/2026, ver comentário em
   * home.html) - por padrão o TestBed mantém blocos `@defer` em modo manual (não
   * resolvidos), então sem isso `fixture.debugElement.query` nunca acharia esses
   * componentes. Resolve cada bloco pra `Complete` e confirma que o componente real
   * aparece no DOM - garante que o `@defer` não quebrou a renderização de nenhuma seção.
   */
  it('resolve todos os @defer e renderiza as 6 seções abaixo da dobra', async () => {
    const deferBlocks = await fixture.getDeferBlocks();
    expect(deferBlocks.length).toBe(6);

    for (const block of deferBlocks) {
      await block.render(DeferBlockState.Complete);
    }
    fixture.detectChanges();

    for (const selector of [
      'app-about',
      'app-skills',
      'app-experience',
      'app-project',
      'app-testimonials',
      'app-contact-me',
    ]) {
      expect(fixture.debugElement.query(By.css(selector)), selector).not.toBeNull();
    }
  });
});
