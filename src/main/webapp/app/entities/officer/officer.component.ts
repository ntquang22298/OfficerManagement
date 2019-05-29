import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { IOfficer, OfficerType, OfficerDegree } from 'app/shared/model/officer.model';
import { IUnit, Unit } from 'app/shared/model/unit.model';
import { AccountService } from 'app/core';
import { OfficerService } from './officer.service';
import { UnitService } from '../unit';
@Component({
  selector: 'jhi-officer',
  templateUrl: './officer.component.html',
  styleUrls: ['officer.component.scss']
})
export class OfficerComponent implements OnInit, OnDestroy {
  officers: IOfficer[];
  units: IUnit[];
  unit: IUnit;
  currentAccount: any;
  eventSubscriber: Subscription;
  results: any[];
  officerTypes = Object.values(OfficerType);
  officerDegrees = Object.values(OfficerDegree);
  offcierType: OfficerType;
  officerDegree: OfficerDegree;
  officerSearch: IOfficer;
  searchType: OfficerType;
  searchDegree: OfficerDegree;
  searchUnit: any;
  constructor(
    protected officerService: OfficerService,
    protected unitService: UnitService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {
    this.loadUnits();
  }

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

  searchOfficer() {
    let unitName: string;
    if (this.searchUnit == null) {
      unitName = '0';
    } else {
      unitName = this.searchUnit;
    }
    this.officerService
      .search(unitName, this.searchDegree, this.searchType)
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

  loadUnits() {
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
  findByName() {
    this.officerService
      .findByName(this.officerSearch.fullName)
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
    this.officerService
      .query()
      .pipe(
        filter((res: HttpResponse<IOfficer[]>) => res.ok),
        map((res: HttpResponse<IOfficer[]>) => res.body)
      )
      .subscribe(
        (res: IOfficer[]) => {
          this.officers = res;
          this.results = this.filterOfficer(query, this.officers);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
  filterOfficer(query, officers: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < officers.length; i++) {
      let officer = officers[i];
      if (officer.fullName.toLowerCase().includes(query.toLowerCase()) === true) {
        filtered.push(officer);
      }
    }
    return filtered;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
