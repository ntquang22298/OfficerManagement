import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IUnit } from 'app/shared/model/unit.model';
import { AccountService } from 'app/core';
import { UnitService } from './unit.service';

@Component({
  selector: 'jhi-unit',
  templateUrl: './unit.component.html'
})
export class UnitComponent implements OnInit, OnDestroy {
  units: IUnit[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected unitService: UnitService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.unitService
      .query()
      .pipe(
        filter((res: HttpResponse<IUnit[]>) => res.ok),
        map((res: HttpResponse<IUnit[]>) => res.body)
      )
      .subscribe(
        (res: IUnit[]) => {
          this.units = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInUnits();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IUnit) {
    return item.id;
  }

  registerChangeInUnits() {
    this.eventSubscriber = this.eventManager.subscribe('unitListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
