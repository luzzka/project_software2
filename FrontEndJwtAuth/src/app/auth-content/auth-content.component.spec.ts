import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthContentComponent } from './auth-content.component';
import { UsuarioService } from '../services/usuario.service';
import { ProyectoService } from '../services/proyecto.service';
import { AxiosService } from '../services/axios.service';
import { ModalService } from '../services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Usuario } from '../clases/Usuario';
import { Proyecto } from '../clases/Proyecto';
import { ChangeDetectorRef } from '@angular/core';

describe('AuthContentComponent', () => {
  let component: AuthContentComponent;
  let fixture: ComponentFixture<AuthContentComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let proyectoServiceSpy: jasmine.SpyObj<ProyectoService>;
  let axiosServiceSpy: jasmine.SpyObj<AxiosService>;
  let modalServiceSpy: jasmine.SpyObj<ModalService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let changeDetectorRefSpy: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['getUsuario']);
    const proyectoSpy = jasmine.createSpyObj('ProyectoService', ['getProyectos']);
    const axiosSpy = jasmine.createSpyObj('AxiosService', ['getAuthToken', 'setAuthToken'], {
      loginData$: of({ login: 'testUser' })
    });
    const modalSpy = jasmine.createSpyObj('ModalService', ['abrirModal']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteMock = {
      params: of({})
    };
    const changeDetectorRefSpyObj = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [AuthContentComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioSpy },
        { provide: ProyectoService, useValue: proyectoSpy },
        { provide: AxiosService, useValue: axiosSpy },
        { provide: ModalService, useValue: modalSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ChangeDetectorRef, useValue: changeDetectorRefSpyObj }
      ]
    }).compileComponents();

    usuarioServiceSpy = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    proyectoServiceSpy = TestBed.inject(ProyectoService) as jasmine.SpyObj<ProyectoService>;
    axiosServiceSpy = TestBed.inject(AxiosService) as jasmine.SpyObj<AxiosService>;
    modalServiceSpy = TestBed.inject(ModalService) as jasmine.SpyObj<ModalService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    activatedRouteSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    changeDetectorRefSpy = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthContentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on ngOnInit', () => {
    const mockUser: Usuario = { login: 'testUser' } as Usuario;
    usuarioServiceSpy.getUsuario.and.returnValue(of(mockUser));
    component.ngOnInit();
    expect(usuarioServiceSpy.getUsuario).toHaveBeenCalledWith('testUser');
    expect(component.usuario).toEqual(mockUser);
  });

  it('should load projects on ngOnInit', () => {
    const mockProyectos: Proyecto[] = [{ id: 1, nombreProyecto: 'Test Project' } as Proyecto];
    proyectoServiceSpy.getProyectos.and.returnValue(of({ proyectos: mockProyectos }));
    component.userData = { login: 'testUser' };
    component.ngOnInit();
    expect(proyectoServiceSpy.getProyectos).toHaveBeenCalledWith('testUser');
    expect(component.proyectosList).toEqual(mockProyectos);
  });

  it('should toggle showSignInForm when navigating to sign in', () => {
    expect(component.showSignInForm).toBeFalse();
    component.navigateToSignIn();
    expect(component.showSignInForm).toBeTrue();
  });

  it('should toggle showSignInForm when navigating back', () => {
    component.showSignInForm = true;
    component.navigateBack();
    expect(component.showSignInForm).toBeFalse();
  });

  it('should logout and navigate to login page', () => {
    component.logout();
    expect(axiosServiceSpy.setAuthToken).toHaveBeenCalledWith(null);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should open modal for project update', () => {
    component.abrirModalUpdate(1);
    expect(component.projectID).toBe(1);
    expect(changeDetectorRefSpy.detectChanges).toHaveBeenCalled();
    expect(modalServiceSpy.abrirModal).toHaveBeenCalled();
  });

  it('should reload projects when modal is closed', () => {
    spyOn(component, 'cargarProyectos');
    component.onModalClosed();
    expect(component.cargarProyectos).toHaveBeenCalled();
  });

  it('should toggle showTareasComponent', () => {
    expect(component.showTareasComponent).toBeFalse();
    component.onShowTareasComponent();
    expect(component.showTareasComponent).toBeTrue();
    component.onHideTareasComponent();
    expect(component.showTareasComponent).toBeFalse();
  });

  it('should load projects correctly', () => {
    const mockProyectos: Proyecto[] = [{ id: 1, nombreProyecto: 'Test Project' } as Proyecto];
    proyectoServiceSpy.getProyectos.and.returnValue(of({ proyectos: mockProyectos }));
    component.userData = { login: 'testUser' };
    component.cargarProyectos();
    expect(proyectoServiceSpy.getProyectos).toHaveBeenCalledWith('testUser');
    expect(component.proyectosList).toEqual(mockProyectos);
  });
});
