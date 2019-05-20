import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IOfficer } from 'app/shared/model/officer.model';
import { IUnit } from 'app/shared/model/unit.model';
import { AccountService } from 'app/core';
import { OfficerService } from './officer.service';
import { UnitService, unitPopupRoute } from '../unit';
@Component({
  selector: 'jhi-officer',
  templateUrl: './officer.component.html'
})
export class OfficerComponent implements OnInit, OnDestroy {
  officers: IOfficer[];
  units: IUnit[];
  unit: IUnit;
  currentAccount: any;
  eventSubscriber: Subscription;
  results: any[];
  constructor(
    protected officerService: OfficerService,
    protected unitService: UnitService,
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
    if (this.unit.name == null) {
      this.loadAll();
    }
    this.officerService
      .findByUnit(this.unit.name)
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

  search(event) {
    let query = event.query;
    this.unitService
      .query()
      .pipe(
        filter((res: HttpResponse<IUnit[]>) => res.ok),
        map((res: HttpResponse<IUnit[]>) => res.body)
      )
      .subscribe(
        (res: IUnit[]) => {
          this.units = res;
          this.results = this.filterUnit(query, this.units);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
  filterUnit(query, units: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < units.length; i++) {
      let unit = units[i];
      if (unit.name.toLowerCase().includes(query.toLowerCase()) === true) {
        filtered.push(unit);
      }
    }
    return filtered;
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
