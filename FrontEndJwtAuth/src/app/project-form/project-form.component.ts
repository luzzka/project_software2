import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { ProyectoService } from '../services/proyecto.service';
import { AxiosService } from '../services/axios.service';
import { Proyecto } from '../clases/Proyecto';
import { FormsModule} from "@angular/forms";
import { NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [FormsModule,NgIf],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit{

  @Input() userData:any;
  private _ProyectId: number;
  Guardar_Actualizar:boolean=true;
  @Output() modalClosed: EventEmitter<any> = new EventEmitter();

  nuevoProyecto:Proyecto=new Proyecto();

  nombreProyecto: string="";
  descripcionProyecto: string="";
  fechaInicioProyecto: string="";
  fechaFinProyecto: string="";
  tipo: string="DESARROLLO";
  estado: string="PENDIENTE";

  constructor(private proyectoService:ProyectoService
             ,public modalService:ModalService
             ,public axiosService:AxiosService
             ,public activatedRoute:ActivatedRoute) {
  }

  ngOnInit(): void {
        this.cargarProyecto()
    }

  @Input()
  set ProyectId(value: number) {
    this._ProyectId = value;
    if (this._ProyectId !== null) {
      this.Guardar_Actualizar=false;
      this.cargarProyecto();
    }
    else {
      this.Guardar_Actualizar=true;
      this.limpiarFormulario();
    }
  }

  get ProyectId(): number {
    return this._ProyectId;
  }

  limpiarFormulario():void{
    this.nombreProyecto="";
    this.descripcionProyecto="";
    this.fechaInicioProyecto="";
    this.fechaFinProyecto="";
    this.tipo="DESARROLLO";
    this.estado="PENDIENTE";
  }

  crearProyecto(): void {
    console.log(this.nombreProyecto);
    console.log(this.descripcionProyecto);
    console.log(this.fechaInicioProyecto);
    console.log(this.fechaFinProyecto);
    console.log(this.tipo);
    console.log(this.estado);
    this.nuevoProyecto.nombreProyecto=this.nombreProyecto;
    this.nuevoProyecto.descripcionProyecto=this.descripcionProyecto;
    this.nuevoProyecto.fechaInicioProyecto=this.fechaInicioProyecto;

    this.nuevoProyecto.fechaFinProyecto=this.fechaFinProyecto;

    this.nuevoProyecto.tipo=this.tipo;

    this.nuevoProyecto.estado=this.estado;

    if (this.userData && this.userData.login) {
      this.axiosService.getAuthToken();
      this.proyectoService.postProyecto(this.nuevoProyecto,this.userData.login)
        .subscribe(response => {
          this.cerrarModal()});
    }
  }

  actualizarProyecto(): void {
    this.nuevoProyecto.nombreProyecto=this.nombreProyecto;
    this.nuevoProyecto.descripcionProyecto=this.descripcionProyecto;
    this.nuevoProyecto.fechaInicioProyecto=this.fechaInicioProyecto;
    this.nuevoProyecto.fechaFinProyecto=this.fechaFinProyecto;
    this.nuevoProyecto.tipo=this.tipo;
    this.nuevoProyecto.estado=this.estado;

    if (this.userData && this.userData.login) {
      this.axiosService.getAuthToken();
      this.proyectoService.putProyecto(this.nuevoProyecto,this.ProyectId)
        .subscribe(response => {
          this.cerrarModal()});
    }
  }

  cargarProyecto(): void {
    if (this.ProyectId!=null) {
      this.axiosService.getAuthToken();
      this.activatedRoute.params.subscribe(params => {
        this.proyectoService.getProyectoById(this.ProyectId)
          .subscribe(proyecto => {
            this.nombreProyecto = proyecto.proyecto.nombreProyecto;
            this.descripcionProyecto = proyecto.proyecto.descripcionProyecto;
            this.fechaInicioProyecto= proyecto.proyecto.fechaInicioProyecto;
            this.fechaFinProyecto=proyecto.proyecto.fechaFinProyecto;
            this.tipo = proyecto.proyecto.tipo;
            this.estado = proyecto.proyecto.estado;
          });
      });
    }
  }

  cerrarModal(): void {
    this.modalService.cerrarModal();
    this.nuevoProyecto=new Proyecto();
    this.modalClosed.emit(); // Emitir el evento modalClosed al cerrar el modal
  }
}
