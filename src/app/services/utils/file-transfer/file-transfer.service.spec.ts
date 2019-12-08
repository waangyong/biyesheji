import { TestBed } from '@angular/core/testing';

import { FileTransferService } from './file-transfer.service';

describe('FileTransferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileTransferService = TestBed.get(FileTransferService);
    expect(service).toBeTruthy();
  });
});
