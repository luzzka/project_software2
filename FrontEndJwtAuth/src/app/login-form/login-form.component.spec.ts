import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { AxiosService } from '../services/axios.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let axiosServiceSpy: jasmine.SpyObj<AxiosService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let swalFireSpy: jasmine.Spy;

  beforeEach(async () => {
    const axiosSpy = jasmine.createSpyObj('AxiosService', ['request', 'setLoginData', 'setAuthToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, FormsModule],
      providers: [
        { provide: AxiosService, useValue: axiosSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    axiosServiceSpy = TestBed.inject(AxiosService) as jasmine.SpyObj<AxiosService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize login and password as empty strings', () => {
    expect(component.login).toBe('');
    expect(component.password).toBe('');
  });

  it('should call onLogin when onSubmitLogin is called', () => {
    spyOn(component, 'onLogin');
    component.login = 'testuser';
    component.password = 'testpass';
    component.onSubmitLogin();
    expect(component.onLogin).toHaveBeenCalledWith({login: 'testuser', password: 'testpass'});
  });

  it('should handle successful login', fakeAsync(() => {
    const mockResponse = {
      data: {
        mensaje: 'Login exitoso',
        user: { token: 'fake-token' }
      }
    };
    axiosServiceSpy.request.and.returnValue(Promise.resolve(mockResponse));

    component.onLogin({login: 'testuser', password: 'testpass'});
    tick(); // Simula el paso del tiempo para las operaciones asíncronas

    expect(axiosServiceSpy.request).toHaveBeenCalledWith('POST', '/login', {login: 'testuser', password: 'testpass'});
    expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      title: 'Login exitoso',
      text: 'Login exitoso',
    }));

    tick(); // Simula el paso del tiempo para el then() después del Swal.fire

    expect(axiosServiceSpy.setLoginData).toHaveBeenCalledWith({login: 'testuser', token: 'fake-token'});
    expect(axiosServiceSpy.setAuthToken).toHaveBeenCalledWith('fake-token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/AuthContent', { redirected: true }]);
  }));

  it('should handle login failure', fakeAsync(() => {
    const mockError = {
      response: {
        data: {
          mensaje: 'Error en el login',
          error: 'Credenciales inválidas'
        }
      }
    };
    axiosServiceSpy.request.and.returnValue(Promise.reject(mockError));

    component.onLogin({login: 'testuser', password: 'wrongpass'});
    tick(); // Simula el paso del tiempo para las operaciones asíncronas

    expect(axiosServiceSpy.request).toHaveBeenCalledWith('POST', '/login', {login: 'testuser', password: 'wrongpass'});
    expect(swalFireSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error en el login',
      text: 'Error en el login\nCredenciales inválidas'
    }));

    tick(); // Simula el paso del tiempo para el then() después del Swal.fire

    expect(axiosServiceSpy.setAuthToken).toHaveBeenCalledWith(null);
  }));
});
