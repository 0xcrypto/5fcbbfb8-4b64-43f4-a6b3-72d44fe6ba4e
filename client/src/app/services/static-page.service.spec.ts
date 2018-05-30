import { TestBed, inject } from '@angular/core/testing';

import { StaticPageService } from './static-page.service';

describe('StaticPageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaticPageService]
    });
  });

  it('should be created', inject([StaticPageService], (service: StaticPageService) => {
    expect(service).toBeTruthy();
  }));
});
