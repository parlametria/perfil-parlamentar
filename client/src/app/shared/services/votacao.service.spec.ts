import { TestBed } from '@angular/core/testing';

import { VotacaoService } from './votacao.service';

describe('VotacaoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VotacaoService = TestBed.get(VotacaoService);
    expect(service).toBeTruthy();
  });
});
