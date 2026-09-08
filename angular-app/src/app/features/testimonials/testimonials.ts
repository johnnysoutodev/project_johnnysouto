import { Component } from '@angular/core';
import { Tag } from '../../shared/components/tag/tag';

/** Um card de depoimento (design-system.md secao 8.7). */
interface Testimonial {
  readonly name: string;
  readonly role: string;
  readonly quote: string;
}

/**
 * Testimonials — design-system.md secao 8.7 (card de depoimento). Sem subsecao propria
 * de raiz/heading documentada (ao contrario de About/Skills/Experience/Contact me,
 * secoes 8.9-8.12) - o heading abaixo (Tag + Subtitle/Normal centralizado) segue o
 * MESMO padrao repetido nas outras secoes de conteudo com heading centralizado, mesma
 * inferencia ja registrada no Project (`features/project/project.ts`), nao uma extracao
 * formal do node `316:510`. Fundo (`--color-gray-50`) tambem por inferencia: o Figma nao
 * documenta a cor de fundo da RAIZ da secao (so a do card, branco, replicada em
 * `testimonials.scss`), mas o padrao alternado ja confirmado nas outras secoes (Hero
 * branco / About cinza / Skills branco / Experience cinza / Project branco, ja
 * implementado) aponta pra Testimonials cinza, fechando a sequencia com Contact me
 * (branco, confirmado na spec 8.12) e Footer (cinza, 8.2).
 * `host: { id: 'testimonials' }` para a ancora `#testimonials` ja referenciada pela
 * navegacao do Header.
 *
 * CONTEUDO 100% FICTICIO (design-system.md secao 10: "sem equivalente real - decisao:
 * manter a estrutura do Figma com 3 depoimentos ficticios, claramente marcados no
 * componente como placeholder temporario"). O curriculo do Johnny nao tem secao de
 * depoimentos - os 3 itens abaixo NAO sao pessoas reais, nem inspirados em pessoas
 * reais. Marcados de duas formas (alem deste comentario): (1) nome literal "Depoimento
 * de exemplo N" em vez de um nome humano inventado que poderia ser confundido com uma
 * pessoa real; (2) nota visivel no subtitulo do heading (`testimonials.html`),
 * perceptivel a qualquer revisor olhando a pagina RENDERIZADA, nao so o codigo-fonte.
 */
@Component({
  selector: 'app-testimonials',
  imports: [Tag],
  host: { id: 'testimonials' },
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  protected readonly testimonials: readonly Testimonial[] = [
    {
      name: 'Depoimento de exemplo 1',
      role: 'Cargo e empresa fictícios',
      quote:
        'Texto de depoimento de exemplo, usado apenas para demonstrar o layout desta ' +
        'seção. Ainda não há depoimentos reais de clientes ou colegas de trabalho ' +
        'cadastrados aqui.',
    },
    {
      name: 'Depoimento de exemplo 2',
      role: 'Cargo e empresa fictícios',
      quote:
        'Este também é um depoimento fictício, com um comprimento de texto um pouco ' +
        'diferente do primeiro, só para simular a variação de altura entre os cards ' +
        'já prevista no design original.',
    },
    {
      name: 'Depoimento de exemplo 3',
      role: 'Cargo e empresa fictícios',
      quote:
        'Terceiro depoimento de exemplo, propositalmente mais longo que os dois ' +
        'anteriores, reproduzindo a variação de altura observada nos 3 cards ' +
        'originais do Figma (design-system.md, seção 8.7) — lá também o card mais ' +
        'alto é o que tem o texto mais extenso.',
    },
  ];
}
