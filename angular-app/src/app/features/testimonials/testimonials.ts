import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Tag } from '../../shared/components/tag/tag';

/** Foto real do avatar, quando disponivel (ver `Testimonial.photo`). */
interface TestimonialPhoto {
  readonly src: string;
  readonly alt: string;
}

/**
 * Um card de depoimento (design-system.md secao 8.7). `photo` opcional: quando ausente,
 * o avatar cai no icone generico de usuario (ver `testimonials.html`).
 */
interface Testimonial {
  readonly name: string;
  readonly role: string;
  readonly quote: string;
  readonly photo?: TestimonialPhoto;
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
 * CONTEUDO REAL (08/09/2026, a pedido do Johnny - substitui a decisao original da
 * secao 10, que previa 3 depoimentos ficticios por falta de equivalente real): 2
 * depoimentos reais, com foto (`photo`, ver `TestimonialPhoto`) fornecida pelo Johnny em
 * `public/assets/images/`.
 */
@Component({
  selector: 'app-testimonials',
  imports: [Tag, NgOptimizedImage],
  host: { id: 'testimonials' },
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  protected readonly testimonials: readonly Testimonial[] = [
    {
      name: 'Alexandre Franco',
      role: 'DBA da Capgemini',
      photo: { src: '/assets/images/profile_testmonial_01.jpeg', alt: 'Alexandre Franco' },
      quote:
        '"Excelente profissional, sempre empenhado e focado em seus desafios. ' +
        'Coordenou uma migração de projeto com 22 pessoas com postura ' +
        'firme e competência."',
    },
    {
      name: 'Raphaela Simon',
      role: 'Coordenadora da Totvs',
      photo: { src: '/assets/images/profile_testmonial_02.png', alt: 'Raphaela Simon' },
      quote:
        '"Johnny é um profissional em quem sei que posso confiar e contar. Sua ' +
        'competência técnica, postura colaborativa e senso de responsabilidade ' +
        'fazem muita diferença nas nossas entregas. Destaco também sua abertura ' +
        'para aprender sobre UX e sua generosidade em compartilhar conhecimento. ' +
        'Nossas trocas sempre ampliam minha visão sobre os desafios e ' +
        'possibilidades do desenvolvimento front-end. É um profissional que ' +
        'fortalece o time, tanto pela qualidade do que entrega quanto pela forma ' +
        'como contribui para o crescimento de quem trabalha ao seu lado. É um ' +
        'prazer contar com a sua parceria!"',
    },
  ];
}
