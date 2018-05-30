import { TestBed, inject } from '@angular/core/testing';

import { AdvertisementService } from '../services/advertisement.service';

describe('AdvertisementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdvertisementService]
    });
  });

  it('should be created', inject([AdvertisementService], (service: AdvertisementService) => {
    expect(service).toBeTruthy();
  }));
});
