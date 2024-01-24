import { TestBed } from '@angular/core/testing';

import { PlayerProviderService } from './player-provider.service';

describe('PlayerProviderService', () => {
  let service: PlayerProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
