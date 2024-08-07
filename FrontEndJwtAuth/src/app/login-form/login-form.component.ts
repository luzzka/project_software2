import { EventEmitter, Component, Output } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgStyle} from "@angular/common";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AxiosService } from '../services/axios.service';
import { NavigationExtras } from '@angular/router';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule, NgClass,NgStyle,ProjectFormComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  login: string = "";
  password: string = "";

  constructor(private axiosService: AxiosService, private router: Router) {
  }

  onSubmitLogin(): void {
    this.onLogin({login: this.login, password: this.password});
  }
  
  onLogin(input: any): void {
    this.axiosService.request(
      "POST",
      "/login",
      {
        login: input.login,
        password: input.password
      }).then(
      (response: any) => {
        // Mostrar SweetAlert2 de login exitoso
        Swal.fire({
          icon: 'success',
          title: 'Login exitoso',
          text: response.data.mensaje,
        }).then(() => {
          // Enviar la información de autenticación al componente AuthComponent
          this.axiosService.setLoginData({
            login: input.login,
            token: response.data.user.token
          });
          this.router.navigate(['/AuthContent', { redirected: true }]);
        });
        this.axiosService.setAuthToken(response.data.user.token);
      }).catch(
      (error: any) => {
        // Mostrar SweetAlert2 de error
        Swal.fire({
          icon: 'error',
          title: 'Error en el login',
          text: error.response.data.mensaje + '\n' + error.response.data.error
        }).then(() => {
          this.axiosService.setAuthToken(null);
        });
      }
    );
  }

}
