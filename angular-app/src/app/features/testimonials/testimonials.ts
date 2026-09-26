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
 * secao 10, que previa 3 depoimentos ficticios por falta de equivalente real): 3
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
      role: $localize`:@@testimonial.alexandre.role:DBA na Capgemini`,
      photo: { src: 'assets/images/profile_testmonial_01.jpeg', alt: 'Alexandre Franco' },
      quote: $localize`:@@testimonial.alexandre.quote:"Excelente profissional, sempre empenhado e focado em seus desafios. Coordenou uma migração de projeto com 22 pessoas com postura firme e competência."`,
    },
    {
      name: 'Raphaela Simon',
      role: $localize`:@@testimonial.raphaela.role:Líder na TOTVS`,
      photo: { src: 'assets/images/profile_testmonial_02.png', alt: 'Raphaela Simon' },
      quote: $localize`:@@testimonial.raphaela.quote:"Johnny é um profissional em quem sei que posso confiar e contar. Sua competência técnica, postura colaborativa e senso de responsabilidade fazem muita diferença nas nossas entregas."`,
    },
    {
      name: 'Cesar Sales Lima',
      role: $localize`:@@testimonial.cesar.role:Especialista em Observabilidade na IBM`,
      photo: { src: 'assets/images/profile_testmonial_03.jpeg', alt: 'Cesar Sales Lima' },
      quote: $localize`:@@testimonial.cesar.quote:"Além da competência profissional, destaca-se pelo trabalho em equipe, postura colaborativa e disposição para apoiar colegas nos desafios do dia a dia. Recomendo fortemente seu trabalho."`,
    },
    {
      name: 'Marion Almeida',
      role: $localize`:@@testimonial.marion.role:Coordenador na Nielsen`,
      photo: { src: 'assets/images/profile_testmonial_04.jpeg', alt: 'Marion Almeida' },
      quote: $localize`:@@testimonial.marion.quote:"Tive o prazer de trabalhar com o Johnny e posso dizer que foi uma experiência muito positiva. É um profissional extremamente organizado, empático e fácil de lidar, além de ter uma excelente capacidade de ensinar e compartilhar conhecimento."`,
    },
  ];
}
