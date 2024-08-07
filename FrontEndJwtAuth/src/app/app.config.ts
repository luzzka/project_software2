import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { AuthGuardService } from './services/auth-guard.service';
import { UsuarioService } from './services/usuario.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),AuthGuardService,UsuarioService, provideHttpClient(withFetch()), provideAnimationsAsync(),]
};
