import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConcernArea } from 'app/shared/model/concern-area.model';

@Component({
  selector: 'jhi-concern-area-detail',
  templateUrl: './concern-area-detail.component.html'
})
export class ConcernAreaDetailComponent implements OnInit {
  concernArea: IConcernArea;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ concernArea }) => {
      this.concernArea = concernArea;
    });
  }

  previousState() {
    window.history.back();
  }
}
