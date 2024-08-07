import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with modal closed', () => {
    expect(service.modal).toBeFalse();
  });

  it('should open modal', () => {
    service.abrirModal();
    expect(service.modal).toBeTrue();
  });

  it('should close modal', () => {
    service.abrirModal(); // Primero abrimos el modal
    service.cerrarModal();
    expect(service.modal).toBeFalse();
  });

  it('should have a notificarUpload EventEmitter', () => {
    expect(service.notificarUpload).toBeTruthy();
    expect(service.notificarUpload.constructor.name).toBe('EventEmitter_');
  });

  it('should emit event when notificarUpload is called', (done) => {
    service.notificarUpload.subscribe((data) => {
      expect(data).toBe('test');
      done();
    });
    service.notificarUpload.emit('test');
  });
});
