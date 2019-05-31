import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IConcernArea } from 'app/shared/model/concern-area.model';
import { AccountService } from 'app/core';
import { ConcernAreaService } from './concern-area.service';

@Component({
  selector: 'jhi-concern-area',
  templateUrl: './concern-area.component.html'
})
export class ConcernAreaComponent implements OnInit, OnDestroy {
  concernAreas: IConcernArea[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected concernAreaService: ConcernAreaService,
    protected jhiAlertService: JhiAlertService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.concernAreaService
      .findAllByUser()
      .pipe(
        filter((res: HttpResponse<IConcernArea[]>) => res.ok),
        map((res: HttpResponse<IConcernArea[]>) => res.body)
      )
      .subscribe(
        (res: IConcernArea[]) => {
          this.concernAreas = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInConcernAreas();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IConcernArea) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInConcernAreas() {
    this.eventSubscriber = this.eventManager.subscribe('concernAreaListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error("Officer not found", null, null);
  }
}
