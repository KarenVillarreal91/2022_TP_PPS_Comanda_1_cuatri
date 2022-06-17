import { TestBed } from '@angular/core/testing';

import { DeckcardsService } from './deckcards.service';

describe('DeckcardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeckcardsService = TestBed.get(DeckcardsService);
    expect(service).toBeTruthy();
  });
});
