import { Component, DestroyRef, PLATFORM_ID, inject, signal } from '@angular/core';
import { NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { IconButton } from '../../shared/components/icon-button/icon-button';
import { Tag } from '../../shared/components/tag/tag';

/** Campo que acabou de ser copiado (feedback visual temporario no Icon Button de "copiar"). */
type CopyField = 'email' | 'phone';

/**
 * Contact me — design-system.md secao 8.12. Tudo empilhado numa unica coluna central
 * (heading -> email -> telefone -> social), alinhamento centralizado em todos os
 * niveis - sem divisao em colunas lado a lado (confirmado na spec, diferente do Header).
 * `host: { id: 'contact' }` para a ancora `#contact` ja referenciada pela navegacao do
 * Header.
 *
 * Conteudo real (secao 10 + pedido desta tarefa): email `johnnyjns@gmail.com` (icone
 * `icon-mail`); telefone `+55 11 99703-7799` como link `tel:+5511997037799` (icone
 * `icon-phone`); GitHub `github.com/johnnysoutodev` (icone
 * `icon-social-github`, mesmo padrao ja usado no Hero - Icon Button linkando pra fora);
 * LinkedIn `linkedin.com/in/johnnysouto` como link de texto simples, SEM icone (decisao
 * ja confirmada em 8.12/10 - nao ha icone de LinkedIn em lugar nenhum do arquivo Figma).
 *
 * Email/telefone viram links reais (`mailto:`/`tel:`) - decisao de implementacao por
 * convencao (nao uma spec extraida do 8.12, que so documenta o texto como conteudo
 * visual), consistente com GitHub/LinkedIn ja serem links reais no Hero. O telefone era
 * originalmente um link `https://wa.me/...` (WhatsApp) - trocado pelo Johnny pra um
 * `tel:` simples (liga direto, sem depender do WhatsApp estar instalado).
 */
@Component({
  selector: 'app-contact-me',
  imports: [IconButton, NgOptimizedImage, Tag],
  host: { id: 'contact' },
  templateUrl: './contact-me.html',
  styleUrl: './contact-me.scss',
})
export class ContactMe {
  // `navigator.clipboard` so existe no browser - mesma guarda de SSR-safety ja usada em
  // `core/theme/theme.ts` (design-system.md/ai-instructions.md: todo acesso a API de
  // browser dentro de logica que possa rodar no servidor precisa dessa guarda). Na
  // pratica `copy()` abaixo so roda a partir de um `(click)` do template - eventos de
  // template nunca disparam durante o prerender/SSR - mas a guarda fica mesmo assim,
  // defensiva, seguindo a mesma convencao do projeto em vez de assumir "so roda no
  // browser na pratica".
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private resetTimeoutId: ReturnType<typeof setTimeout> | null = null;

  protected readonly email = 'johnnyjns@gmail.com';
  /**
   * Assunto pre-preenchido do link de email (a pedido do Johnny, 08/09/2026) -
   * `encodeURIComponent` no assunto (nao concatenacao direta no template) pra escapar
   * o espaco/acentos corretamente na query string do `mailto:`.
   */
  protected readonly mailtoHref = `mailto:${this.email}?subject=${encodeURIComponent('Vamos bater um papo?')}`;
  protected readonly phoneDisplay = '+55 11 99703-7799';
  protected readonly phoneHref = 'tel:+5511997037799';
  protected readonly githubUrl = 'https://github.com/johnnysoutodev';
  protected readonly linkedinUrl = 'https://www.linkedin.com/in/johnnysouto';

  /**
   * Campo copiado nos ultimos ~2s (feedback visual: icone/aria-label do botao "copiar"
   * mudam enquanto nao-null) - `null` fora desse intervalo, inclusive no estado inicial.
   */
  protected readonly copiedField = signal<CopyField | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => this.clearResetTimeout());
  }

  protected async copy(field: CopyField, value: string): Promise<void> {
    if (!this.isBrowser || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      this.clearResetTimeout();
      this.copiedField.set(field);
      this.resetTimeoutId = setTimeout(() => this.copiedField.set(null), 2000);
    } catch {
      // Permissao de clipboard negada/indisponivel (ex.: contexto inseguro, navegador
      // sem suporte a Clipboard API) - sem feedback de "copiado", mas sem quebrar a
      // pagina; o valor continua disponivel como texto/link selecionavel normalmente.
    }
  }

  private clearResetTimeout(): void {
    if (this.resetTimeoutId !== null) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
  }
}
