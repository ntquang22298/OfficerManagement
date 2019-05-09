import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IDiary } from 'app/shared/model/diary.model';
import { AccountService } from 'app/core';
import { DiaryService } from './diary.service';

@Component({
  selector: 'jhi-diary',
  templateUrl: './diary.component.html'
})
export class DiaryComponent implements OnInit, OnDestroy {
  diaries: IDiary[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected diaryService: DiaryService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.diaryService
      .query()
      .pipe(
        filter((res: HttpResponse<IDiary[]>) => res.ok),
        map((res: HttpResponse<IDiary[]>) => res.body)
      )
      .subscribe(
        (res: IDiary[]) => {
          this.diaries = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInDiaries();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IDiary) {
    return item.id;
  }

  registerChangeInDiaries() {
    this.eventSubscriber = this.eventManager.subscribe('diaryListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
