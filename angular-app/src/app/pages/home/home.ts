import { Component } from '@angular/core';
import { Hero } from '../../features/hero/hero';
import { About } from '../../features/about/about';
import { Skills } from '../../features/skills/skills';
import { Experience } from '../../features/experience/experience';
import { Project } from '../../features/project/project';
import { Testimonials } from '../../features/testimonials/testimonials';
import { ContactMe } from '../../features/contact-me/contact-me';

/**
 * Pagina Home - compoe as 7 secoes de conteudo da landing page (Hero, About, Skills,
 * Experience, Project, Testimonials, Contact me), na mesma ordem do Figma (design-system.md
 * secao 1; a secao "Project" corresponde ao frame "Work" do Figma, componente Angular
 * renomeado em 08/09/2026 a pedido do Johnny - conteudo real sempre foram projetos).
 * Cada secao vive em `features/<secao>/`, um standalone component por secao; todas as 7
 * secoes ja saíram do esqueleto (T6-T12 do plano de implementacao).
 * Registrada na rota '' (app.routes.ts) - site single-page, navegacao por ancora
 * (#about #project #testimonials #contact, ja referenciadas pelo Header).
 */
@Component({
  selector: 'app-home',
  imports: [Hero, About, Skills, Experience, Project, Testimonials, ContactMe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
