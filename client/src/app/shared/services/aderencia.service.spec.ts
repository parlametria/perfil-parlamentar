import { TestBed } from '@angular/core/testing';

import { AderenciaService } from './aderencia.service';

describe('AderenciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AderenciaService = TestBed.get(AderenciaService);
    expect(service).toBeTruthy();
  });
});
