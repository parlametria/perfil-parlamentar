import { TestBed } from '@angular/core/testing';

import { OrientacaoService } from './orientacao.service';

describe('OrientacaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrientacaoService = TestBed.get(OrientacaoService);
    expect(service).toBeTruthy();
  });
});
