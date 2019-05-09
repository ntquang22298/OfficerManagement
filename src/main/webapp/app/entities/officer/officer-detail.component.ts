import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOfficer } from 'app/shared/model/officer.model';

@Component({
  selector: 'jhi-officer-detail',
  templateUrl: './officer-detail.component.html'
})
export class OfficerDetailComponent implements OnInit {
  officer: IOfficer;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ officer }) => {
      this.officer = officer;
    });
  }

  previousState() {
    window.history.back();
  }
}
