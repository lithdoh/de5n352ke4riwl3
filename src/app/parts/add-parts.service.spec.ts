import { TestBed } from '@angular/core/testing';

import { AddPartsService } from './add-parts.service';

describe('AddPartsService', () => {
  let service: AddPartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
