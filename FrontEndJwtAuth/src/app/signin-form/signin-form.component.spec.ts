import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SigninFormComponent } from './signin-form.component';
import { AxiosService } from '../services/axios.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

describe('SigninFormComponent', () => {
  let component: SigninFormComponent;
  let fixture: ComponentFixture<SigninFormComponent>;
  let axiosServiceSpy: jasmine.SpyObj<AxiosService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let swalFireSpy: jasmine.Spy;

  beforeEach(async () => {
    const axiosSpy = jasmine.createSpyObj('AxiosService', ['getAuthToken', 'request', 'setAuthToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SigninFormComponent, FormsModule],
      providers: [
        { provide: AxiosService, useValue: axiosSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SigninFormComponent);
    component = fixture.componentInstance;
    axiosServiceSpy = TestBed.inject(AxiosService) as jasmine.SpyObj<AxiosService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when password is empty', () => {
    component.password = '';
    component.onSubmitRegister();
    expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Error',
      text: 'El campo de contraseña no puede estar vacío'
    }));
  });

  it('should call onRegister with correct parameters when form is valid', () => {
    spyOn(component, 'onRegister');
    component.apellidos = 'Doe';
    component.nombres = 'John';
    component.login = 'johndoe';
    component.password = 'password123';
    component.correo = 'john@example.com';
    component.telefono = '1234567890';
    component.esAdministrador = false;

    component.onSubmitRegister();

    expect(component.onRegister).toHaveBeenCalledWith(jasmine.objectContaining({
      apellidos: 'Doe',
      nombres: 'John',
      login: 'johndoe',
      password: 'password123',
      correo: 'john@example.com',
      telefono: '1234567890',
      esAdministrador: false
    }));
  });

  it('should handle successful registration', fakeAsync(() => {
    const mockResponse = {
      data: {
        mensaje: 'Registro exitoso',
        token: 'fake-token'
      }
    };
    axiosServiceSpy.request.and.returnValue(Promise.resolve(mockResponse));

    component.onRegister({
      apellidos: 'Doe',
      nombres: 'John',
      login: 'johndoe',
      password: 'password123',
      correo: 'john@example.com',
      telefono: '1234567890',
      esAdministrador: false
    });

    tick();

    expect(axiosServiceSpy.getAuthToken).toHaveBeenCalled();
    expect(axiosServiceSpy.request).toHaveBeenCalledWith(
      'POST',
      '/register',
      jasmine.objectContaining({
        apellidos: 'Doe',
        nombres: 'John',
        login: 'johndoe',
        password: 'password123',
        correo: 'john@example.com',
        telefono: '1234567890',
        esAdministrador: false
      })
    );
    expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Registro exitoso',
      text: 'Registro exitoso'
    }));
    expect(axiosServiceSpy.setAuthToken).toHaveBeenCalledWith('fake-token');
  }));

  it('should handle registration error', fakeAsync(() => {
    const mockError = {
      response: {
        data: {
          errors: ['Error 1', 'Error 2']
        }
      }
    };
    axiosServiceSpy.request.and.returnValue(Promise.reject(mockError));

    component.onRegister({
      apellidos: 'Doe',
      nombres: 'John',
      login: 'johndoe',
      password: 'password123',
      correo: 'john@example.com',
      telefono: '1234567890',
      esAdministrador: false
    });

    tick();

    expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Error al registrar',
      html: '<h4>Error 1</h4><h4>Error 2</h4>'
    }));
    expect(axiosServiceSpy.setAuthToken).toHaveBeenCalledWith(null);
  }));
});
