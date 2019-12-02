import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetoriaComponent } from './trajetoria.component';

describe('TrajetoriaComponent', () => {
  let component: TrajetoriaComponent;
  let fixture: ComponentFixture<TrajetoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
