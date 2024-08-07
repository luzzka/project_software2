import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../clases/Usuario';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlEndPoint: string = "http://localhost:8080/api/usuario"
  private httpHeaders = new HttpHeaders('Content-Type:application/json')

  constructor(private http: HttpClient, private router: Router) {

  }
  getAuthToken(): string | null {
    return window.localStorage.getItem("auth_token");
  }

  getUsuario(login): Observable<Usuario> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.getAuthToken() !== null) {
      headers = headers.set('Authorization', 'Bearer ' + this.getAuthToken());
    }
    return this.http.get<Usuario>(`${this.urlEndPoint}/${login}`, {headers: headers}).pipe(
      catchError(e => {
        console.error(e.error.mensaje)
        Swal.fire("Error al obtener usuario", e.error.mensaje, "error");
        return throwError(e);
      })
    )
  }

}
