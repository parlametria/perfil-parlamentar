import { TestBed } from '@angular/core/testing';

import { CargosMesaService } from './cargos-mesa.service';

describe('CargosMesaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CargosMesaService = TestBed.get(CargosMesaService);
    expect(service).toBeTruthy();
  });
});
