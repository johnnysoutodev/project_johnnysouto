import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page.component';
import { PrinterPageComponent } from './pages/printer-page.component';

export const routes: Routes = [
	{
		path: '',
		component: HomePageComponent,
		data: { lang: 'pt' }
	},
	{
		path: 'en',
		component: HomePageComponent,
		data: { lang: 'en' }
	},
	{
		path: 'printer',
		component: PrinterPageComponent,
		data: { lang: 'pt' }
	},
	{
		path: 'en/printer',
		component: PrinterPageComponent,
		data: { lang: 'en' }
	},
	{
		path: '**',
		redirectTo: ''
	}
];
