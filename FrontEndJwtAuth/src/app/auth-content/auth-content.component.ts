import {ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CommonModule, NgFor, NgForOf, NgIf} from "@angular/common";
import {SigninFormComponent} from '../signin-form/signin-form.component';
import {AxiosService} from '../services/axios.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Usuario} from '../clases/Usuario';
import {UsuarioService} from '../services/usuario.service';
import {FormsModule} from '@angular/forms';
import {ProjectCardComponent} from '../project-card/project-card.component';
import {TareasComponent} from '../tareas/tareas.component';
import {ProyectoService} from '../services/proyecto.service';
import {Proyecto} from '../clases/Proyecto';
import {ModalService} from '../services/modal.service';
import {ProjectFormComponent} from '../project-form/project-form.component';

@Component({
  selector: 'app-auth-content',
  standalone: true,
  imports: [
    NgFor, NgForOf, NgIf,
    SigninFormComponent,
    CommonModule, FormsModule, RouterModule,
    ProjectCardComponent,
    ProjectFormComponent,
    TareasComponent
  ],
  templateUrl: './auth-content.component.html',
  styleUrl: './auth-content.component.css'
})
export class AuthContentComponent implements OnInit, OnChanges {
  usuario: Usuario = new Usuario();
  proyectosList: Proyecto[] = []; // Declaración de la lista de proyectos
  userData: any;
  showSignInForm = false;
  showTareasComponent: boolean = false;
  projectID:number;

  onUpdateProject(projectId: number) {
    this.abrirModalUpdate(projectId);
  }

  onHideTareasComponent(): void {
    this.showTareasComponent = false;
  }

  onShowTareasComponent(): void {
    this.showTareasComponent = true;
  }

  constructor(private usuarioService: UsuarioService,
              private proyectoService: ProyectoService,
              private axiosService: AxiosService,
              private activatedRoute: ActivatedRoute,
              private modalService: ModalService,
              private router: Router,
              private cdr: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cargarProyectos();
    }

  onModalClosed(): void {
    this.cargarProyectos(); // Llama a la función cargarProyectos cuando se cierra el modal
  }
  OnMostrarProyectos() {
    this.cargarProyectos(); // Llama a la función cargarProyectos cuando se borre el proyecto
  }
  ngOnInit(): void {
    this.axiosService.loginData$.subscribe(data => {
      this.userData = data;
    });

    this.cargarUsuario();
    this.cargarProyectos();
  }

  public cargarUsuario(): void {
    if (this.userData && this.userData.login) {
      this.usuarioService.getUsuario(this.userData.login).subscribe((usuario) => this.usuario = usuario);
    }
  }

  cargarProyectos(): void {
    if (this.userData && this.userData.login) {
      this.axiosService.getAuthToken();
      this.activatedRoute.params.subscribe(params => {
        this.proyectoService.getProyectos(this.userData.login)
          .subscribe(response => {
            this.proyectosList = response.proyectos; // Asigna la respuesta a la lista de proyectos
          });
      });
    }
  }
  navigateToSignIn() {
    this.showSignInForm = true;
  }

  navigateBack() {
    this.showSignInForm = false;
  }

  // Aquí está la nueva función de cierre de sesión
  logout() {
    this.axiosService.setAuthToken(null);
    this.router.navigate(['/login']); // Redirige a /login
  }

  abrirModal(userData:any,projectId: number){
    this.userData=userData;
    this.projectID = projectId;
    console.log(this.projectID);
    this.cdr.detectChanges();
    this.modalService.abrirModal();
  }

  abrirModalUpdate(projectId: number) {
    this.projectID = projectId;
    console.log(this.projectID);
    this.cdr.detectChanges();
    this.modalService.abrirModal();
  }


/*Parte de Proyectos
  projects = [
    {
      id: 1,
      title: 'Diseño de Interfaz de Usuario con Bootstrap 5',
      description: 'El diseño de aplicaciones web es una etapa importante al construir una aplicación web',
      progress: 45, // tareas completas/ total tareas
      startDate: '1 Ene, 2023',
      endDate: '1 Sept, 2023'
    },
    {
      id: 2,
      title: 'Desarrollo de una Aplicación Móvil con React Native',
      description: 'Creación de una aplicación móvil para facilitar las compras en línea',
      progress: 60,
      startDate: '1 Feb, 2023',
      endDate: '1 Oct, 2023'
    },
    {
      id: 3,
      title: 'Implementación de una API REST con Node.js',
      description: 'Desarrollo de una API REST para gestionar los datos de una aplicación de gestión de tareas',
      progress: 100,
      startDate: '1 Mar, 2023',
      endDate: '1 Nov, 2023'
    },
    {
      id: 4,
      title: 'Creación de un Blog con WordPress',
      description: 'Configuración de un blog personalizado con WordPress para compartir recetas de cocina',
      progress: 75,
      startDate: '1 Abr, 2023',
      endDate: '1 Dic, 2023'
    },
    {
      id: 5,
      title: 'Desarrollo de un Juego con Unity',
      description: 'Creación de un juego de aventuras en 3D utilizando el motor de juegos Unity',
      progress: 30,
      startDate: '1 May, 2023',
      endDate: '1 Ene, 2024'
    }
  ];
  */



}
