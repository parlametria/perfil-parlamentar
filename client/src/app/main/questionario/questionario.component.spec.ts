import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionarioComponent } from './questionario.component';

describe('QuestionarioComponent', () => {
  let component: QuestionarioComponent;
  let fixture: ComponentFixture<QuestionarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
