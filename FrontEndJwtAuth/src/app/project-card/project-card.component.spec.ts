import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectCardComponent } from './project-card.component';
import { ModalService } from '../services/modal.service';
import { ProyectoService } from '../services/proyecto.service';
import { AxiosService } from '../services/axios.service';
import { CommonModule } from '@angular/common';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockProyectoService: jasmine.SpyObj<ProyectoService>;
  let mockAxiosService: jasmine.SpyObj<AxiosService>;

  beforeEach(async () => {
    mockModalService = jasmine.createSpyObj('ModalService', ['openModal']);
    mockProyectoService = jasmine.createSpyObj('ProyectoService', ['deleteProyecto']);
    mockAxiosService = jasmine.createSpyObj('AxiosService', ['getAuthToken']);

    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent, CommonModule, ProjectFormComponent],
      providers: [
        { provide: ModalService, useValue: mockModalService },
        { provide: ProyectoService, useValue: mockProyectoService },
        { provide: AxiosService, useValue: mockAxiosService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    component.project = { id: 1, nombreProyecto: 'Test Project' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit updateProject event when onUpdateProject is called', () => {
    spyOn(component.updateProject, 'emit');
    component.onUpdateProject(new Event('click'));
    expect(component.updateProject.emit).toHaveBeenCalledWith(1);
  });

  it('should emit mostrarTareas event when onMostrarTareas is called', () => {
    spyOn(component.mostrarTareas, 'emit');
    component.onMostrarTareas();
    expect(component.mostrarTareas.emit).toHaveBeenCalled();
  });

  it('should call deleteProyecto and emit mostrarProyectos when borrarProyecto is confirmed', (done) => {
    mockProyectoService.deleteProyecto.and.returnValue(of({}));
    spyOn(component.mostrarProyectos, 'emit');
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.borrarProyecto();

    setTimeout(() => {
      expect(mockAxiosService.getAuthToken).toHaveBeenCalled();
      expect(mockProyectoService.deleteProyecto).toHaveBeenCalledWith(1);
      expect(component.mostrarProyectos.emit).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith('¡Proyecto eliminado con éxito!', '', 'success');
      done();
    });
  });

  it('should toggle dropdown menu when toggleDropdown is called', () => {
    const mockElement = {
      querySelector: jasmine.createSpy('querySelector').and.returnValue({
        classList: {
          toggle: jasmine.createSpy('toggle')
        }
      })
    };
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation'),
      currentTarget: mockElement
    } as any;

    component.toggleDropdown(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockElement.querySelector).toHaveBeenCalledWith('.dropdown-menu');
    expect(mockElement.querySelector('.dropdown-menu')?.classList.toggle).toHaveBeenCalledWith('show');
  });
});
