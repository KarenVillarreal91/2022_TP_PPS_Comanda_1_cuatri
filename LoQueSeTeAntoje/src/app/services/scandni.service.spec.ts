import { TestBed } from '@angular/core/testing';

import { ScandniService } from './scandni.service';

describe('ScandniService', () => {
  let service: ScandniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScandniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
