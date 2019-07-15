import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacaoComponent } from './votacao.component';

describe('VotacaoComponent', () => {
  let component: VotacaoComponent;
  let fixture: ComponentFixture<VotacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
