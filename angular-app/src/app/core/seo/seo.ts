import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { LanguageService } from '../i18n/language';

/** Dominio do site (o mesmo do site legado, `og:url` anterior). */
export const SITE_URL = 'https://www.johnnysouto.com.br';

/**
 * SEO por idioma: titulo, description, canonical e Open Graph do idioma do build atual.
 * As tags ficam aqui (e nao em `index.html`) porque o Angular so processa `i18n` em
 * templates de componentes, nao no `index.html`. Como o site e prerenderizado, `Title`/`Meta`
 * escrevem essas tags no HTML estatico de cada idioma (lido por buscadores e redes sociais
 * sem executar JS). `hreflang`, `og:type` e `og:image` sao iguais em todos os idiomas e ficam
 * estaticos no `index.html`.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly language = inject(LanguageService);

  apply(): void {
    const title = $localize`:@@seo.title:Johnny Souto | Engenheiro de Software`;
    const description = $localize`:@@seo.description:Engenheiro de Software com mais de 20 anos de experiência em TI: front-end, back-end, bancos de dados, Cloud e DevOps. Portfólio profissional de Johnny Souto.`;
    const { code, path } = this.language.current;
    const url = `${SITE_URL}/${path}/`;

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:locale', content: code.replace('-', '_') });
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
