import { Component } from '@angular/core';
import { Hero } from '../../features/hero/hero';
import { About } from '../../features/about/about';
import { Skills } from '../../features/skills/skills';
import { Experience } from '../../features/experience/experience';
import { Work } from '../../features/work/work';

/**
 * Pagina Home - compoe as 7 secoes de conteudo da landing page (Hero, About, Skills,
 * Experience, Work, Testimonials, Contact me), na mesma ordem do Figma (design-system.md
 * secao 1). Cada secao vive em `features/<secao>/`, um standalone component por secao;
 * Hero (T6), About e Skills (T7/T8), Experience e Work (T9/T10, mesma tarefa) ja saíram
 * do esqueleto - as demais (Testimonials, Contact me) seguem como comentario em
 * `home.html` ate suas proprias tarefas.
 * Registrada na rota '' (app.routes.ts) - site single-page, navegacao por ancora
 * (#about #work #testimonials #contact, ja referenciadas pelo Header).
 */
@Component({
  selector: 'app-home',
  imports: [Hero, About, Skills, Experience, Work],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
