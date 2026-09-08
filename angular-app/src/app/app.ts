import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { ScrollToTop } from './layout/scroll-to-top/scroll-to-top';

@Component({
  imports: [RouterOutlet, Header, Footer, ScrollToTop],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
