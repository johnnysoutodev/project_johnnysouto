import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { calculateExperienceYears } from '../../features/hero/hero';
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
    // Mesmo texto do Hero (anos de experiencia calculados, nao fixos no texto).
    const years = calculateExperienceYears(new Date().getFullYear());
    const description = $localize`:@@seo.description:Sou um profissional de TI com mais de ${years}:years: anos de experiência, atuando desde suporte técnico, bancos de dados, front-end, back-end, análise de negócios, implantando, configurando e prestando consultoria de sistemas a diversas empresas.`;
    const { code, path } = this.language.current;
    const url = `${SITE_URL}/${path}/`;

    // O build define `<html lang>` com o locale do Angular (`pt`/`es`); o BCP 47 completo
    // (`pt-BR`/`es-ES`) e o que buscadores e leitores de tela esperam.
    this.document.documentElement.lang = code;
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
