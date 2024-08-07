import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgClass, NgStyle} from "@angular/common";
import Swal from 'sweetalert2';
import { AxiosService } from '../services/axios.service';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports:[FormsModule, NgClass,NgStyle],
  templateUrl: './signin-form.component.html',
  styleUrl: './signin-form.component.css'
})
export class SigninFormComponent {
  nombres: string = "";
  apellidos: string = "";
  correo: string = "";
  telefono: string = "";
  login: string = "";
  password: string = "";
  esAdministrador: boolean = false;

  constructor(private axiosService: AxiosService, private router: Router) { }


  onSubmitRegister(): void {
    if (!this.password) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El campo de contraseña no puede estar vacío'
      });
    } else {
      this.onRegister({
        apellidos: this.apellidos,
        nombres: this.nombres,
        login: this.login,
        password: this.password,
        correo: this.correo,
        telefono: this.telefono,
        esAdministrador: this.esAdministrador
      });
    }
  }

  onRegister(input: any): void {
    this.axiosService.getAuthToken();
    this.axiosService.request(
      "POST",
      "/register",
      {
        apellidos: input.apellidos,
        nombres: input.nombres,
        login: input.login,
        password: input.password,
        correo: input.correo,
        telefono: input.telefono,
        esAdministrador: input.esAdministrador
      }).then(
      response => {
        // Mostrar SweetAlert2 de registro exitoso
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: response.data.mensaje
        });
        this.axiosService.setAuthToken(response.data.token);
      }).catch(
      error => {
        // Mostrar SweetAlert2 de error en el registro con mensajes de error
        let errorMessage = Array.isArray(error.response.data.errors) ?
          error.response.data.errors.map((error: string[]) => `<h4>${error}</h4>`).join('') :
          error.response.data.error;
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          html: errorMessage
        }).then(() => {
          this.axiosService.setAuthToken(null);
        });
      }
    );
  }
  
}
