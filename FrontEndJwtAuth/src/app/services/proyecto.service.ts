import {HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Proyecto } from '../clases/Proyecto';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private urlEndPoint: string = "http://localhost:8080/api/proyectos"
  private httpHeaders = new HttpHeaders('Content-Type:application/json')

  constructor(private http: HttpClient, private router: Router) {

  }
  getAuthToken(): string | null {
    return window.localStorage.getItem("auth_token");
  }

  getProyectoById(proyectoId: number): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.getAuthToken() !== null) {
      headers = headers.set('Authorization', 'Bearer ' + this.getAuthToken());
    }
    return this.http.get<Proyecto>(`${this.urlEndPoint}/proyecto/${proyectoId}`, {headers: headers}).pipe(
      catchError(e => {
        Swal.fire("Error al obtener el proyecto", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }

  getProyectos(login: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.getAuthToken() !== null) {
      headers = headers.set('Authorization', 'Bearer ' + this.getAuthToken());
    }
    return this.http.get<any>(`${this.urlEndPoint}/usuario/${login}`, {headers: headers}).pipe(
      catchError(e => {
        console.error(e.error.mensaje)
        Swal.fire("Error al obtener usuario", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }

  postProyecto(proyecto: Proyecto, login: string): Observable<Proyecto> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.getAuthToken() !== null) {
      headers = headers.set('Authorization', 'Bearer ' + this.getAuthToken());
    }
    return this.http.post<Proyecto>(`${this.urlEndPoint}/usuario/${login}`, proyecto, { headers: headers }).pipe(
      catchError(e => {
        let errorMessage = Array.isArray(e.error.errors) ?
          e.error.errors.map((error: string[]) => `<h4>${error}</h4>`).join('') :
          e.error.mensaje;
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          html: errorMessage
        })
        return throwError(e);
      }),
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Proyecto creado',
          text: 'El proyecto ha sido creado con éxito'
        });
      })
    );
  }

  putProyecto(proyecto: Proyecto, id: number): Observable<Proyecto> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.getAuthToken() !== null) {
      headers = headers.set('Authorization', 'Bearer ' + this.getAuthToken());
    }
    return this.http.put<Proyecto>(`${this.urlEndPoint}/proyecto/${id}`, proyecto, { headers: headers }).pipe(
      catchError(e => {
        let errorMessage = Array.isArray(e.error.errors) ?
          e.error.errors.map((error: string[]) => `<h4>${error}</h4>`).join('') :
          e.error.mensaje;
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          html: errorMessage
        })
        return throwError(e);
      }),
      tap(response => {
        Swal.fire({
          icon: 'success',
          title: 'Proyecto actualizado',
          text: 'El proyecto ha sido actualizado con éxito'
        });
      })
    );
  }

    deleteProyecto(id: number): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    if (this.getAuthToken() !== null) {
      headers = headers.set('Authorization', 'Bearer ' + this.getAuthToken());
    }
    return this.http.delete<any>(`${this.urlEndPoint}/proyecto/${id}`, {headers: headers}).pipe(
      catchError(e => {
        console.error(e.error.mensaje)
        Swal.fire("Error al borrar proyecto", e.error.mensaje, "error");
        return throwError(e);
      })
    );
  }
}
