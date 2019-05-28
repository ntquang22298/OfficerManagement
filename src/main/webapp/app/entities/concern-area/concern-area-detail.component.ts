import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IConcernArea } from 'app/shared/model/concern-area.model';

@Component({
  selector: 'jhi-concern-area-detail',
  templateUrl: './concern-area-detail.component.html'
})
export class ConcernAreaDetailComponent implements OnInit {
  concernArea: IConcernArea;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ concernArea }) => {
      this.concernArea = concernArea;
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}
