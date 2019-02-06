import { TestBed } from '@angular/core/testing';

import { PerguntaService } from './pergunta.service';

describe('PerguntaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerguntaService = TestBed.get(PerguntaService);
    expect(service).toBeTruthy();
  });
});
