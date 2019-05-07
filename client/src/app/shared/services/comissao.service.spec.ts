import { TestBed } from '@angular/core/testing';

import { ComissaoService } from './comissao.service';

describe('ComissaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComissaoService = TestBed.get(ComissaoService);
    expect(service).toBeTruthy();
  });
});
