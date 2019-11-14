import { TestBed } from '@angular/core/testing';

import { PerfilPoliticoService } from './perfil-politico.service';

describe('PerfilPoliticoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerfilPoliticoService = TestBed.get(PerfilPoliticoService);
    expect(service).toBeTruthy();
  });
});
