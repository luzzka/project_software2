import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProyectoService } from './proyecto.service';
import { Router } from '@angular/router';
import { Proyecto } from '../clases/Proyecto';
import { of, throwError } from 'rxjs';

describe('ProyectoService', () => {
  let service: ProyectoService;
  let httpMock: HttpTestingController;

  const mockProyecto: Proyecto = {
    id: 1,
    nombreProyecto: 'Proyecto de prueba',
    descripcionProyecto: 'Esta es una descripción de prueba',
    fechaInicioProyecto: '2023-01-01',
    fechaFinProyecto: '2023-12-31',
    tipo: 'IA',
    estado: 'En progreso',
    tareas: ['t1','t2']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProyectoService,
        { provide: Router, useValue: {} }
      ]
    });
    service = TestBed.inject(ProyectoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get auth token from localStorage', () => {
    spyOn(window.localStorage, 'getItem').and.returnValue('test_token');
    expect(service.getAuthToken()).toBe('test_token');
  });

  it('should get proyecto by id', () => {
    service.getProyectoById(1).subscribe(proyecto => {
      expect(proyecto).toEqual(mockProyecto);
    });

    const req = httpMock.expectOne(`${service['urlEndPoint']}/proyecto/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProyecto);
  });

  it('should get proyectos for a user', () => {
    const mockProyectos = [mockProyecto];
    service.getProyectos('testuser').subscribe(proyectos => {
      expect(proyectos).toEqual(mockProyectos);
    });

    const req = httpMock.expectOne(`${service['urlEndPoint']}/usuario/testuser`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProyectos);
  });

  it('should post a new proyecto', () => {
    service.postProyecto(mockProyecto, 'testuser').subscribe(proyecto => {
      expect(proyecto).toEqual(mockProyecto);
    });

    const req = httpMock.expectOne(`${service['urlEndPoint']}/usuario/testuser`);
    expect(req.request.method).toBe('POST');
    req.flush(mockProyecto);
  });

  it('should update a proyecto', () => {
    service.putProyecto(mockProyecto, 1).subscribe(proyecto => {
      expect(proyecto).toEqual(mockProyecto);
    });

    const req = httpMock.expectOne(`${service['urlEndPoint']}/proyecto/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProyecto);
  });

  it('should delete a proyecto', () => {
    service.deleteProyecto(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service['urlEndPoint']}/proyecto/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should handle errors when getting proyecto by id', () => {
    service.getProyectoById(1).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(`${service['urlEndPoint']}/proyecto/1`);
    req.flush('Error', { status: 404, statusText: 'Not Found' });
  });

  // Puedes añadir pruebas similares para manejar errores en otros métodos
});
