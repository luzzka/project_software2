import { TestBed } from '@angular/core/testing';
import { AxiosService } from './axios.service';
import axios from 'axios';

describe('AxiosService', () => {
  let service: AxiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AxiosService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get auth token', () => {
    const token = 'test-token';
    service.setAuthToken(token);
    expect(service.getAuthToken()).toBe(token);
  });

  it('should remove auth token when set to null', () => {
    service.setAuthToken('test-token');
    service.setAuthToken(null);
    expect(service.getAuthToken()).toBeNull();
  });

  it('should set login data and emit it through observable', (done) => {
    const testData = { username: 'test' };
    let emissionCount = 0;
    service.loginData$.subscribe(data => {
      emissionCount++;
      if (emissionCount === 2) {  // Espera la segunda emisión
        expect(data).toEqual(testData);
        done();
      }
    });
    service.setLoginData(testData);
  });

  it('should make a request without auth token', (done) => {
    spyOn(axios, 'request').and.returnValue(Promise.resolve({ data: 'test' }));
    service.request('GET', '/test', {}).then(result => {
      expect(result.data).toBe('test');
      expect(axios.request).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        data: {},
        headers: {}
      });
      done();
    });
  });

  it('should make a request with auth token', (done) => {
    const token = 'test-token';
    service.setAuthToken(token);
    spyOn(axios, 'request').and.returnValue(Promise.resolve({ data: 'test' }));
    service.request('POST', '/test', { key: 'value' }).then(result => {
      expect(result.data).toBe('test');
      expect(axios.request).toHaveBeenCalledWith({
        method: 'POST',
        url: '/test',
        data: { key: 'value' },
        headers: { Authorization: `Bearer ${token}` }
      });
      done();
    });
  });

  it('should set axios defaults in constructor', () => {
    expect(axios.defaults.baseURL).toBe('http://localhost:8080');
    expect(axios.defaults.headers.post['Content-Type']).toBe('application/json');
  });
});
