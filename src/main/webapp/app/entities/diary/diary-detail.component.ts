import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDiary } from 'app/shared/model/diary.model';

@Component({
  selector: 'jhi-diary-detail',
  templateUrl: './diary-detail.component.html'
})
export class DiaryDetailComponent implements OnInit {
  diary: IDiary;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ diary }) => {
      this.diary = diary;
    });
  }

  previousState() {
    window.history.back();
  }
}
