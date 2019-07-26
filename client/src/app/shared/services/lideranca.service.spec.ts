import { TestBed } from '@angular/core/testing';

import { LiderancaService } from './lideranca.service';

describe('LiderancaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiderancaService = TestBed.get(LiderancaService);
    expect(service).toBeTruthy();
  });
});
