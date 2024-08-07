import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectFormComponent } from './project-form.component';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../services/modal.service';
import { ProyectoService } from '../services/proyecto.service';
import { AxiosService } from '../services/axios.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Proyecto } from '../clases/Proyecto';

describe('ProjectFormComponent', () => {
  let component: ProjectFormComponent;
  let fixture: ComponentFixture<ProjectFormComponent>;
  let mockProyectoService: jasmine.SpyObj<ProyectoService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockAxiosService: jasmine.SpyObj<AxiosService>;
  let mockActivatedRoute: any;

  const mockProyecto: Proyecto = {
    id: 1,
    nombreProyecto: 'Test Project',
    descripcionProyecto: 'Description',
    fechaInicioProyecto: '2024-01-01',
    fechaFinProyecto: '2024-12-31',
    tipo: 'DESARROLLO',
    estado: 'PENDIENTE',
    tareas: ['t1']
  };

  beforeEach(async () => {
    mockProyectoService = jasmine.createSpyObj('ProyectoService', ['postProyecto', 'putProyecto', 'getProyectoById']);
    mockModalService = jasmine.createSpyObj('ModalService', ['cerrarModal']);
    mockAxiosService = jasmine.createSpyObj('AxiosService', ['getAuthToken'], {
      loginData$: of({ login: 'testUser' })
    });
    mockActivatedRoute = {
      params: of({ id: 1 })
    };

    mockProyectoService.getProyectoById.and.returnValue(of({ proyecto: mockProyecto }));

    await TestBed.configureTestingModule({
      imports: [ProjectFormComponent, FormsModule],
      providers: [
        { provide: ProyectoService, useValue: mockProyectoService },
        { provide: ModalService, useValue: mockModalService },
        { provide: AxiosService, useValue: mockAxiosService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    fixture.detectChanges();
    expect(component.nombreProyecto).toBe('');
    expect(component.descripcionProyecto).toBe('');
    expect(component.fechaInicioProyecto).toBe('');
    expect(component.fechaFinProyecto).toBe('');
    expect(component.tipo).toBe('DESARROLLO');
    expect(component.estado).toBe('PENDIENTE');
  });

  it('should clean form when limpiarFormulario is called', () => {
    component.nombreProyecto = 'Test';
    component.limpiarFormulario();
    expect(component.nombreProyecto).toBe('');
    expect(component.tipo).toBe('DESARROLLO');
    expect(component.estado).toBe('PENDIENTE');
  });

  it('should call postProyecto when crearProyecto is called', () => {
    component.userData = { login: 'testUser' };
    component.nombreProyecto = 'Test Project';
    mockProyectoService.postProyecto.and.returnValue(of(mockProyecto));
    component.crearProyecto();
    expect(mockProyectoService.postProyecto).toHaveBeenCalled();
    expect(mockModalService.cerrarModal).toHaveBeenCalled();
  });

  it('should call putProyecto when actualizarProyecto is called', () => {
    component.userData = { login: 'testUser' };
    component.ProyectId = 1;
    component.nombreProyecto = 'Updated Project';
    mockProyectoService.putProyecto.and.returnValue(of(mockProyecto));
    component.actualizarProyecto();
    expect(mockProyectoService.putProyecto).toHaveBeenCalled();
    expect(mockModalService.cerrarModal).toHaveBeenCalled();
  });

  it('should load project data when ProyectId is set', () => {
    component.ProyectId = 1;
    component.ngOnInit();
    expect(mockProyectoService.getProyectoById).toHaveBeenCalledWith(1);
    expect(component.nombreProyecto).toBe('Test Project');
    expect(component.estado).toBe('PENDIENTE');
  });

  it('should emit modalClosed event when cerrarModal is called', () => {
    spyOn(component.modalClosed, 'emit');
    component.cerrarModal();
    expect(mockModalService.cerrarModal).toHaveBeenCalled();
    expect(component.modalClosed.emit).toHaveBeenCalled();
  });

  it('should set Guardar_Actualizar to false when ProyectId is set', () => {
    component.ProyectId = 1;
    component.ngOnInit();
    expect(component.Guardar_Actualizar).toBeFalse();
  });

  it('should set Guardar_Actualizar to true when ProyectId is null', () => {
    component.ProyectId = null;
    component.ngOnInit();
    expect(component.Guardar_Actualizar).toBeTrue();
  });
});
