import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../clases/Usuario';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;

  const mockUsuario: Usuario = {
    esAdministrador: false,
    id: 1,
    nombres: 'pauli',
    apellidos: 'camero',
    correo: 'pauli@prueba.com',
    telefono: '987654321',
    login: 'pau',
    password: '123456',
    proyectos:['p1','p2'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsuarioService,
        { provide: Router, useValue: {} }
      ]
    });
    service = TestBed.inject(UsuarioService);
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

  it('should get usuario', () => {
    const testLogin = 'testuser';

    service.getUsuario(testLogin).subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${service['urlEndPoint']}/${testLogin}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuario);
  });

  it('should handle error when getting usuario', () => {
    const testLogin = 'testuser';
    const errorMessage = 'Error al obtener usuario';

    service.getUsuario(testLogin).subscribe(
      () => fail('should have failed with the error'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.error.mensaje).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne(`${service['urlEndPoint']}/${testLogin}`);
    expect(req.request.method).toBe('GET');
    req.flush({ mensaje: errorMessage }, { status: 404, statusText: 'Not Found' });
  });
});
