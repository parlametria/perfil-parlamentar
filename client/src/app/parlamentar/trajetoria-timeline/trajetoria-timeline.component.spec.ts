import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetoriaTimelineComponent } from './trajetoria-timeline.component';

describe('TrajetoriaTimelineComponent', () => {
  let component: TrajetoriaTimelineComponent;
  let fixture: ComponentFixture<TrajetoriaTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetoriaTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetoriaTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
