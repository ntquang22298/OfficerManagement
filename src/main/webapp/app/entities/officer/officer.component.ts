import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOfficer } from 'app/shared/model/officer.model';
import { AccountService } from 'app/core';
import { OfficerService } from './officer.service';

@Component({
  selector: 'jhi-officer',
  templateUrl: './officer.component.html'
})
export class OfficerComponent implements OnInit, OnDestroy {
  officers: IOfficer[];
  currentAccount: any;
  eventSubscriber: Subscription;
  key: string;
  constructor(
    protected officerService: OfficerService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.officerService
      .query()
      .pipe(
        filter((res: HttpResponse<IOfficer[]>) => res.ok),
        map((res: HttpResponse<IOfficer[]>) => res.body)
      )
      .subscribe(
        (res: IOfficer[]) => {
          this.officers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInOfficers();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IOfficer) {
    return item.id;
  }

  registerChangeInOfficers() {
    this.eventSubscriber = this.eventManager.subscribe('officerListModification', response => this.loadAll());
  }

  findByUnit() {
    this.officerService
      .findByUnit(this.key)
      .pipe(
        filter((res: HttpResponse<IOfficer[]>) => res.ok),
        map((res: HttpResponse<IOfficer[]>) => res.body)
      )
      .subscribe(
        (res: IOfficer[]) => {
          this.officers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
