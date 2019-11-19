import { TestBed } from '@angular/core/testing';

import { BuscaParlamentarService } from './busca-parlamentar.service';

describe('BuscaParlamentarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuscaParlamentarService = TestBed.get(BuscaParlamentarService);
    expect(service).toBeTruthy();
  });
});
