import { TestBed } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { AxiosService } from './axios.service';
import { Router } from '@angular/router';

describe('AuthGuardService', () => {
  let service: AuthGuardService;
  let axiosServiceSpy: jasmine.SpyObj<AxiosService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const axiosSpy = jasmine.createSpyObj('AxiosService', ['getAuthToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: AxiosService, useValue: axiosSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });
    service = TestBed.inject(AuthGuardService);
    axiosServiceSpy = TestBed.inject(AxiosService) as jasmine.SpyObj<AxiosService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow activation when auth token is present', () => {
    axiosServiceSpy.getAuthToken.and.returnValue('some-token');
    expect(service.canActivate()).toBeTruthy();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should prevent activation and redirect to login when auth token is null', () => {
    axiosServiceSpy.getAuthToken.and.returnValue(null);
    expect(service.canActivate()).toBeFalsy();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});
