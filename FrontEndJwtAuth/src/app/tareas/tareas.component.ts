import { Component, EventEmitter, Output } from '@angular/core';
import {NgFor, NgForOf, NgIf} from "@angular/common";
import Swal from 'sweetalert2';

interface Task {
  title: string;
  description: string;
  creationDate: string;
  dueDate: string;
  status: 'EN_PROGRESO' | 'FINALIZADO' | 'PENDIENTE' | 'CANCELADO';
  attachments: Attachment[];
}

interface Attachment {
  name: string;
  link: string;
}

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [ NgFor,NgForOf,NgIf,],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css'
})
export class TareasComponent {

  @Output() showTareasComponentChange = new EventEmitter<boolean>();

  toggleShowTareasComponent(): void {
    this.showTareasComponentChange.emit(false);
  }

  newTask(){
    Swal.fire({
      title: "Nueva Tarea",
      html:`
              <style>
        .form-container {
          background-color: #2c2c2c;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 450px; /* Ancho ajustado */
          color: #f0f0f0;
        }
        .form-container h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #f0f0f0;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          text-align: left;
        }
        .form_reg {
          width: calc(100% - 20px);
          padding: 10px;
          margin: 0 5px;
          border: 1px solid #444;
          border-radius: 4px;
          box-sizing: border-box;
          font-size: 14px;
          background-color: #444;
          color: #f0f0f0;
        }
        .form_reg:focus {
          border-color: #66afe9;
          outline: none;
          box-shadow: 0 0 8px rgba(102, 175, 233, 0.6);
        }
        .radio-group {
          display: flex;
          justify-content: space-between;
          margin: 5px 0;
        }
        .radio-group label {
          margin: 0 2px;
          font-weight: normal;
        }
      </style>

      <form class="form-container">
        <div class="form-group">
          <label for="titulo">Título</label>
          <input type="text" id="titulo" class="form_reg" placeholder="título">
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <input type="text" id="descripcion" class="form_reg" placeholder="descripción">
        </div>
        <div class="form-group">
          <label for="estado">Estado</label>
          <select id="estado" class="form_reg">
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <div class="form-group">
          <label for="f_creacion">Fecha Inicio</label>
          <input type="date" id="f_creacion" class="form_reg" placeholder="fecha de creacion">
        </div>
        <div class="form-group">
          <label for="f_fin">Fecha Finalización</label>
          <input type="date" id="f_fin" class="form_reg" placeholder="fecha de finalizacion">
        </div>
      </form>

      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark/dark.css">
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

      `,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Exito",
          text: "Tarea agregada correctamente",
          icon: "success"
        });
      }
    });
  }
  tasks: Task[] = [
    {
      title: 'Requisitos del Sistema',
      description: 'Documentar todos los requisitos del sistema.',
      creationDate: '2024-05-01',
      dueDate: '2024-05-10',
      status: 'FINALIZADO',
      attachments: [
        { name: 'RequisitosFuncionales.pdf', link: '' },
        { name: 'RequisitosNoFuncionales.docx', link: '' }
      ]
    },
    {
      title: 'Diseño de Arquitectura',
      description: 'Crear el diseño de la arquitectura del sistema.',
      creationDate: '2024-05-11',
      dueDate: '2024-05-20',
      status: 'FINALIZADO',
      attachments: [
        { name: 'DiagramaArquitectura.png', link: '' },
        { name: 'DocumentacionArquitectura.docx', link: '' }
      ]
    },
    {
      title: 'Desarrollo del Frontend',
      description: 'Implementar la interfaz de usuario del sistema.',
      creationDate: '2024-05-21',
      dueDate: '2024-06-10',
      status: 'EN_PROGRESO',
      attachments: [
        { name: 'MockupsUI.pdf', link: '' },
        { name: 'GuiaEstilos.docx', link: '' }
      ]
    },
    {
      title: 'Desarrollo del Backend',
      description: 'Implementar la lógica de negocio y la base de datos del sistema.',
      creationDate: '2024-05-21',
      dueDate: '2024-06-15',
      status: 'EN_PROGRESO',
      attachments: [
        { name: 'EsquemaBD.sql', link: '' },
        { name: 'APIEndpoints.docx', link: '' }
      ]
    },
    {
      title: 'Pruebas del Sistema',
      description: 'Realizar pruebas unitarias e integrales del sistema.',
      creationDate: '2024-06-16',
      dueDate: '2024-06-30',
      status: 'PENDIENTE',
      attachments: [
        { name: 'PlanPruebas.docx', link: '' },
        { name: 'CasosPrueba.xlsx', link: '' }
      ]
    },
    {
      title: 'Despliegue del Sistema',
      description: 'Desplegar el sistema en el entorno de producción.',
      creationDate: '2024-07-01',
      dueDate: '2024-07-05',
      status: 'PENDIENTE',
      attachments: [
        { name: 'GuiaDespliegue.pdf', link: '' },
        { name: 'ChecklistDespliegue.docx', link: '' },
        { name: 'ChecklistDesplieguever2.docx', link: '' },
        { name: 'Analisis y pruebas finales.docx', link: '' },
        { name: 'Presentacion de producto.pptx', link: '' },
      ]
    }
  ];

  constructor() {}

  getPlazo(creationDate: string, dueDate: string): string {
    const creation = new Date(creationDate);
    const due = new Date(dueDate);
    const plazo = Math.ceil((due.getTime() - creation.getTime()) / (1000 * 3600 * 24));
    return plazo.toString() + ' días';
  }
  selectedTaskIndex: number;

  openModal(index: number): void {
    this.selectedTaskIndex = index;
  }

  getNumeroTareas(): number {
    return this.tasks.length;
  }
  getNumeroTareasCompletadas(): number {
    return this.tasks.filter(task => task.status === 'FINALIZADO').length;
  }

  getNumeroTareasActivas(): number {
    return this.tasks.filter(task => task.status === 'EN_PROGRESO' || task.status === 'PENDIENTE').length;
  }

  getProductividad(): number {
    const tareasFinalizadas = this.tasks.filter(task => task.status === 'FINALIZADO').length;
    const tareasEnProgreso = this.tasks.filter(task => task.status === 'EN_PROGRESO').length;
    const tareasPendientes = this.tasks.filter(task => task.status === 'PENDIENTE').length;
    const tareasCanceladas = this.tasks.filter(task => task.status === 'CANCELADO').length;

    const productividad = ((tareasFinalizadas * 0.3 + tareasEnProgreso * 0.2 + tareasPendientes * 0.2 + tareasCanceladas * 0.1) / this.tasks.length) * 100;
    return parseFloat(productividad.toFixed(1));
  }

  getPorcentajeTareasFinalizadas(): number {
    const porcentaje = (this.tasks.filter(task => task.status === 'FINALIZADO').length / this.tasks.length) * 100;
    return parseFloat(porcentaje.toFixed(1));
  }
}
