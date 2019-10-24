import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlenarioComponent } from './plenario.component';

describe('PlenarioComponent', () => {
  let component: PlenarioComponent;
  let fixture: ComponentFixture<PlenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlenarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
