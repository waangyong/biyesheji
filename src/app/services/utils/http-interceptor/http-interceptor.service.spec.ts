import { TestBed } from '@angular/core/testing';

import { HttpReqInterceptorService } from './http-req-interceptor.service';

describe('HttpReqInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpReqInterceptorService = TestBed.get(HttpReqInterceptorService);
    expect(service).toBeTruthy();
  });
});
