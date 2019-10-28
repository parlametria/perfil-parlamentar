import { TestBed } from '@angular/core/testing';

import { CasaService } from './casa.service';

describe('AuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CasaService = TestBed.get(CasaService);
    expect(service).toBeTruthy();
  });
});
