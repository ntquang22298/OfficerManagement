import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { IOfficer, OfficerType, OfficerDegree } from 'app/shared/model/officer.model';
import { LoginService } from 'app/core/login/login.service';
import { LoginModalService, AccountService, Account } from 'app/core';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { OfficerService } from 'app/entities/officer';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  account: Account;
  modalRef: NgbModalRef;
  officers: IOfficer[];

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private loginService: LoginService,
    private router: Router,
    protected jhiAlertService: JhiAlertService,
    protected officerService: OfficerService,
    private eventManager: JhiEventManager
  ) {
    this.loadOfficers();
  }

  ngOnInit() {
    this.accountService.identity().then((account: Account) => {
      this.account = account;
    });
    this.registerAuthenticationSuccess();
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
  loginAsAnonymous() {
    this.loginService
      .login({
        username: 'anonymous',
        password: 'anonymous',
        rememberMe: false
      })
      .then(() => {
        if (this.router.url === '/register' || /^\/activate\//.test(this.router.url) || /^\/reset\//.test(this.router.url)) {
          this.router.navigate(['']);
        }

        this.eventManager.broadcast({
          name: 'authenticationSuccess',
          content: 'Sending Authentication Success'
        });
      });
  }
  loadOfficers() {
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
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
