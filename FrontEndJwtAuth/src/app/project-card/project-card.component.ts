import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {CommonModule, NgClass} from "@angular/common";
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ModalService } from '../services/modal.service';
import { ProyectoService } from '../services/proyecto.service';
import { AxiosService } from '../services/axios.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [NgClass,ProjectFormComponent,CommonModule,DatePipe],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent implements OnInit{

  @Input() project: any;
  @Output() updateProject: EventEmitter<number> = new EventEmitter();
  @Output() mostrarProyectos: EventEmitter<void> = new EventEmitter<void>();
  @Output() mostrarTareas: EventEmitter<void> = new EventEmitter<void>();

  onUpdateProject(event: Event) {
    console.log("Evento Emitido");
    this.updateProject.emit(this.project.id);
  }

  constructor(private modalService: ModalService,
              private proyectoService:ProyectoService
              ,public axiosService:AxiosService) {
  }

  ngOnInit(): void {
    //console.log(this.project.id);
  }
  onMostrarTareas() {
    this.mostrarTareas.emit();
  }

  borrarProyecto(): void {
    if (this.project.id != null) {
      Swal.fire({
        title: `¿Desea borrar el proyecto ${this.project.nombreProyecto}?`,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Los cambios serán irreversibles y no se podrá recuperar el proyecto',
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Regresar'
          }).then((confirmation) => {
            if (confirmation.isConfirmed) {
              this.axiosService.getAuthToken();
              this.proyectoService.deleteProyecto(this.project.id)
                .subscribe(response => {
                  this.mostrarProyectos.emit() // Emitir evento después de borrar el proyecto
                  Swal.fire('¡Proyecto eliminado con éxito!', '', 'success');
                });
            }
          });
        }
      });
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent the click event from propagating to inner elements
    const targetElement = event.currentTarget as Element;
    const dropdownMenu = targetElement.querySelector('.dropdown-menu');
    if (dropdownMenu) {
      dropdownMenu.classList.toggle('show');
    }
  }

}
