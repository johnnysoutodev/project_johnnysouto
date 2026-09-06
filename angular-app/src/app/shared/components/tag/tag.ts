import { Component } from '@angular/core';

/**
 * Tag — design-system.md secao 8.4. Badge nao-interativo (sem estados de hover/active
 * no Figma), reusado em About, Skills, Work, Experience, Testimonials e Contact me.
 * Conteudo (texto do rotulo) via `ng-content`, ja que cada uso tem um texto diferente.
 */
@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
})
export class Tag {}
