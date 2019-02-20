import { TestBed } from '@angular/core/testing';

import { AlinhamentoService } from './alinhamento.service';

describe('AlinhamentoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlinhamentoService = TestBed.get(AlinhamentoService);
    expect(service).toBeTruthy();
  });
});
