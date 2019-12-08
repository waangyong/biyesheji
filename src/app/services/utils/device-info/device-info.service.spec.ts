import { TestBed } from '@angular/core/testing';

import { DeviceInfoService } from './device-info.service';

describe('DeviceInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceInfoService = TestBed.get(DeviceInfoService);
    expect(service).toBeTruthy();
  });
});
