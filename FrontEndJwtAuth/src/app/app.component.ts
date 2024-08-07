import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthContentComponent} from "./auth-content/auth-content.component";
import { LoginFormComponent } from './login-form/login-form.component';
import { AxiosService } from './services/axios.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthContentComponent,LoginFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FrontEndJwtAuth';

  constructor(private axiosService: AxiosService) {
    //Seteamos el token en null para que no pueda acceder a la infomacion desde afuera
    this.axiosService.setAuthToken(null);
  }

}
