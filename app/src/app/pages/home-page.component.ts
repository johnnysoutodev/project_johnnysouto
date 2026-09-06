import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  public currentLang = 'pt';
  public currentYear = new Date().getFullYear();
  public age = this.currentYear - 1982;
  public darkModeEnabled = false;

  ngOnInit(): void {
    this.currentLang = this.route.snapshot.data['lang'] ?? 'pt';
    this.translate.use(this.currentLang);
  }

  toggleTheme(): void {
    this.darkModeEnabled = !this.darkModeEnabled;
    document.body.classList.toggle('dark-mode', this.darkModeEnabled);
  }
}
