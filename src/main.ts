import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

import { registerLocaleData } from '@angular/common';
import localeDeCH from '@angular/common/locales/de-CH';
registerLocaleData(localeDeCH);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
