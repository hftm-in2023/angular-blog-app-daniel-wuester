import { ApplicationConfig, importProvidersFrom } from '@angular/core'; // importProvidersFrom hinzufügen
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms'; // FormsModule importieren

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    // NgModel (Forms) über importProvidersFrom hinzufügen
    importProvidersFrom(FormsModule) // So binden Sie FormsModule in einer Standalone-App ein
  ]
};