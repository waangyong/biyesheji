import { TestBed } from '@angular/core/testing';

import { AppInfoService } from './app-info.service';

describe('HomeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppInfoService = TestBed.get(AppInfoService);
    expect(service).toBeTruthy();
  });
});
