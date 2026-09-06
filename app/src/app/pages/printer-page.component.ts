import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-printer-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './printer-page.component.html',
  styleUrl: './printer-page.component.scss'
})
export class PrinterPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  public currentLang = 'pt';

  ngOnInit(): void {
    this.currentLang = this.route.snapshot.data['lang'] ?? 'pt';
    this.translate.use(this.currentLang);
  }
}
