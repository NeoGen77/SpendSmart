import { TestBed } from '@angular/core/testing';

import { GestionSoldeService } from './gestion-solde.service';

describe('GestionSoldeService', () => {
  let service: GestionSoldeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionSoldeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
