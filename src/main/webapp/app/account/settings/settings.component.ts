import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IOfficer, Officer } from 'app/shared/model/officer.model';
import { IUser, UserService } from 'app/core';
import { IResearchArea } from 'app/shared/model/research-area.model';
import { ResearchAreaService } from 'app/entities/research-area';
import { IConcernArea } from 'app/shared/model/concern-area.model';
import { ConcernAreaService } from 'app/entities/concern-area';
import { IUnit } from 'app/shared/model/unit.model';
import { UnitService } from 'app/entities/unit';
import { AccountService, JhiLanguageHelper } from 'app/core';
import { Account } from 'app/core/user/account.model';
import { OfficerService } from 'app/entities/officer';

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
  error: string;
  success: string;
  languages: any[];
  officer: IOfficer;
  isSaving: boolean;
  users: IUser[];
  researchareas: IResearchArea[];
  concernareas: IConcernArea[];

  units: IUnit[];
  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    activated: [false],
    authorities: [[]],
    langKey: ['en'],
    login: [],
    imageUrl: [],
    unit: [],
    type: [],
    degree: []
  });

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private languageService: JhiLanguageService,
    private languageHelper: JhiLanguageHelper,
    protected jhiAlertService: JhiAlertService,
    protected officerService: OfficerService,
    protected userService: UserService,
    protected researchAreaService: ResearchAreaService,
    protected concernAreaService: ConcernAreaService,
    protected unitService: UnitService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.officerService
      .findByUser()
      .pipe(
        filter((res: HttpResponse<IOfficer>) => res.ok),
        map((res: HttpResponse<IOfficer>) => res.body)
      )
      .subscribe(
        (res: IOfficer) => {
          this.officer = res;
          this.updateForm();
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.unitService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUnit[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUnit[]>) => response.body)
      )
      .subscribe((res: IUnit[]) => (this.units = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  save() {
    const settingsAccount = this.accountFromForm();
    this.accountService.save(settingsAccount).subscribe(
      () => {
        this.error = null;
        this.success = 'OK';
        this.updateForm();
      },
      () => {
        this.success = null;
        this.error = 'ERROR';
      }
    );
  }

  private accountFromForm(): any {
    const account = {};
    return {
      ...account,
      firstName: this.settingsForm.get('firstName').value,
      lastName: this.settingsForm.get('lastName').value,
      email: this.settingsForm.get('email').value,
      activated: this.settingsForm.get('activated').value,
      authorities: this.settingsForm.get('authorities').value,
      langKey: this.settingsForm.get('langKey').value,
      login: this.settingsForm.get('login').value,
      imageUrl: this.settingsForm.get('imageUrl').value
    };
  }

  updateForm(): void {
    let account = this.officer.user;
    this.settingsForm.patchValue({
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.email,
      activated: account.activated,
      authorities: account.authorities,
      langKey: account.langKey,
      login: account.login,
      imageUrl: this.officer.avatarUrl,
      unit: this.officer.unit,
      type: this.officer.type,
      degree: this.officer.degree
    });
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
