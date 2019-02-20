import { TestBed } from '@angular/core/testing';

import { ParlamentarService } from './parlamentar.service';

describe('ParlamentarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParlamentarService = TestBed.get(ParlamentarService);
    expect(service).toBeTruthy();
  });
});
