import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { IMAGE_LOADER } from '@angular/common';
import { responsiveImageLoader } from './core/images/responsive-image-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    // Sem loader nenhum, `ngSrcset` (about.html) so anexaria `?w=N` na mesma URL - inutil
    // no site estatico. Ver comentario em core/images/responsive-image-loader.ts.
    { provide: IMAGE_LOADER, useValue: responsiveImageLoader },
  ],
};
