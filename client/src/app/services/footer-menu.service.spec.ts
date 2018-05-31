import { TestBed, inject } from '@angular/core/testing';

import { FooterMenuService } from './footer-menu.service';

describe('FooterMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FooterMenuService]
    });
  });

  it('should be created', inject([FooterMenuService], (service: FooterMenuService) => {
    expect(service).toBeTruthy();
  }));
});
