import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AxiosService, private router: Router) { }

  canActivate(): boolean {
    //Si el token es null que no permita navegar al contenido
    if (this.authService.getAuthToken()===null) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
