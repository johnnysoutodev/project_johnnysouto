import { Component } from '@angular/core';
import { Hero } from '../../features/hero/hero';
import { About } from '../../features/about/about';
import { Skills } from '../../features/skills/skills';

/**
 * Pagina Home - compoe as 7 secoes de conteudo da landing page (Hero, About, Skills,
 * Experience, Work, Testimonials, Contact me), na mesma ordem do Figma (design-system.md
 * secao 1). Cada secao vive em `features/<secao>/`, um standalone component por secao;
 * Hero (T6), About e Skills (T7/T8, mesma tarefa) ja saíram do esqueleto - as demais
 * seguem como comentario em `home.html` ate suas proprias tarefas.
 * Registrada na rota '' (app.routes.ts) - site single-page, navegacao por ancora
 * (#about #work #testimonials #contact, ja referenciadas pelo Header).
 */
@Component({
  selector: 'app-home',
  imports: [Hero, About, Skills],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
