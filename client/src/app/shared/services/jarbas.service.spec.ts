import { TestBed } from '@angular/core/testing';

import {JarbasService} from './jarbas.service';

describe('JarbasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JarbasService = TestBed.get(JarbasService);
    expect(service).toBeTruthy();
  });
});
