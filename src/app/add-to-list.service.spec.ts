import { TestBed } from '@angular/core/testing';

import { AddToListService } from './add-to-list.service';

describe('AddToListService', () => {
  let service: AddToListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddToListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
