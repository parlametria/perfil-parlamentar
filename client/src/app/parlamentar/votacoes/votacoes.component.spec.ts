import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacoesComponent } from './votacoes.component';

describe('VotacoesComponent', () => {
  let component: VotacoesComponent;
  let fixture: ComponentFixture<VotacoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotacoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
