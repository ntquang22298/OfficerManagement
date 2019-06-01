import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { LoginModalService, AccountService, Account } from 'app/core';
import { OfficerService } from 'app/entities/officer';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IOfficer, OfficerType, OfficerDegree } from 'app/shared/model/officer.model';
import { IUnit, Unit, UnitType } from 'app/shared/model/unit.model';
import { UnitService } from 'app/entities/unit';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {
  account: Account;
  modalRef: NgbModalRef;
  officers: IOfficer[];
  officerSearch: IOfficer;
  results: any[];
  officerTypes = Object.values(OfficerType);
  officerDegrees = Object.values(OfficerDegree);
  offcierType: OfficerType;
  officerDegree: OfficerDegree;
  searchType: OfficerType;
  searchDegree: OfficerDegree;
  searchUnit: any;
  allType: OfficerType;
  allDegree: OfficerDegree;
  all: UnitType;
  units:IUnit[];
  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    protected jhiAlertService: JhiAlertService,
    protected officerService: OfficerService,
    private eventManager: JhiEventManager,
    private router: Router,
    protected unitService: UnitService,
    private config: NgbCarouselConfig

  ) { 
    config.interval = 3000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    this.loadUnits();
  }

  ngOnInit() {
    this.accountService.identity().then((account: Account) => {
      this.account = account;
    });
    this.registerAuthenticationSuccess();
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

  registerAuthenticationSuccess() {
    this.eventManager.subscribe('authenticationSuccess', message => {
      this.accountService.identity().then(account => {
        this.account = account;
      });
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
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
  getOfficer(id: number) {
    this.router.navigate(['/officer/' + id + '/view'])

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
}
