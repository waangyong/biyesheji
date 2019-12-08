import { TestBed } from '@angular/core/testing';

import { ThsLocationService } from './ths-location.service';

describe('ThsLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThsLocationService = TestBed.get(ThsLocationService);
    expect(service).toBeTruthy();
  });
});
