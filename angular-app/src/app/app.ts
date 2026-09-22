import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { ScrollToTop } from './layout/scroll-to-top/scroll-to-top';
import { SeoService } from './core/seo/seo';

@Component({
  imports: [RouterOutlet, Header, Footer, ScrollToTop],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  constructor() {
    // Title/description/canonical/OG do idioma do build (prerenderizados no HTML de cada idioma).
    inject(SeoService).apply();
    // Google Analytics: NAO fica aqui - roda num <script> plano em src/index.html, fora
    // do Angular/zone.js (22/09/2026, a pedido do Johnny; ver o comentario la pra o
    // porque). Removido o AnalyticsService que existia antes.
  }
}
