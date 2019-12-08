import { TestBed } from '@angular/core/testing';

import { ThsMapService } from './ths-map.service';

describe('ThsMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThsMapService = TestBed.get(ThsMapService);
    expect(service).toBeTruthy();
  });
});
