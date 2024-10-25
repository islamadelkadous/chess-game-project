import { TestBed } from '@angular/core/testing';

import { OnlineGamesDataService } from './online-games-data.service';

describe('OnlineGamesDataService', () => {
  let service: OnlineGamesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineGamesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
