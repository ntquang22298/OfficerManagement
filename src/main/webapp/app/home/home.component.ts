import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { LoginModalService, AccountService, Account } from 'app/core';
import { OfficerService } from 'app/entities/officer';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { IOfficer } from 'app/shared/model/officer.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  account: Account;
  modalRef: NgbModalRef;
  officers: IOfficer[];
  officerSearch:IOfficer;
  results: any[];
  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    protected jhiAlertService: JhiAlertService,
    protected officerService: OfficerService,
    private eventManager: JhiEventManager,
  ) { }

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
  }s
}
