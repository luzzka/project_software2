import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TareasComponent } from './tareas.component';
import Swal from 'sweetalert2';

describe('TareasComponent', () => {
  let component: TareasComponent;
  let fixture: ComponentFixture<TareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TareasComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit false when toggleShowTareasComponent is called', () => {
    spyOn(component.showTareasComponentChange, 'emit');
    component.toggleShowTareasComponent();
    expect(component.showTareasComponentChange.emit).toHaveBeenCalledWith(false);
  });

  it('should calculate plazo correctly', () => {
    const plazo = component.getPlazo('2024-05-01', '2024-05-10');
    expect(plazo).toBe('9 días');
  });

  it('should return correct number of tasks', () => {
    expect(component.getNumeroTareas()).toBe(component.tasks.length);
  });

  it('should return correct number of completed tasks', () => {
    const completedTasks = component.tasks.filter(task => task.status === 'FINALIZADO').length;
    expect(component.getNumeroTareasCompletadas()).toBe(completedTasks);
  });

  it('should return correct number of active tasks', () => {
    const activeTasks = component.tasks.filter(task => task.status === 'EN_PROGRESO' || task.status === 'PENDIENTE').length;
    expect(component.getNumeroTareasActivas()).toBe(activeTasks);
  });

  it('should calculate productivity correctly', () => {
    const productivity = component.getProductividad();
    expect(productivity).toBeGreaterThanOrEqual(0);
    expect(productivity).toBeLessThanOrEqual(100);
  });

  it('should calculate percentage of completed tasks correctly', () => {
    const percentage = component.getPorcentajeTareasFinalizadas();
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });

  it('should open modal with correct index', () => {
    component.openModal(2);
    expect(component.selectedTaskIndex).toBe(2);
  });

  it('should call Swal.fire when newTask is called', () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    component.newTask();
    expect(Swal.fire).toHaveBeenCalled();
  });
});
