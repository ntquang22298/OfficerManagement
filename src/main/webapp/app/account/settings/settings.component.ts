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
import { OfficerService } from 'app/entities/officer';
import { ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('alert') alert: ElementRef;
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
    VNUemail: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    activated: [false],
    authorities: [[]],
    langKey: ['en'],
    login: [],
    imageUrl: [],
    unit: [],
    type: [],
    degree: []
  });
  file: File = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    protected jhiAlertService: JhiAlertService,
    protected officerService: OfficerService,
    protected userService: UserService,
    protected researchAreaService: ResearchAreaService,
    protected concernAreaService: ConcernAreaService,
    protected unitService: UnitService,
    protected activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.loadAll();
    this.unitService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUnit[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUnit[]>) => response.body)
      )
      .subscribe((res: IUnit[]) => (this.units = res), (res: HttpErrorResponse) => this.onError(res.message));
  }
  loadAll() {
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
  }
  save() {
    if (this.downloadURL != null) {
      this.downloadURL.subscribe(res => {
        console.log(res.toString());
        const settingsAccount = this.accountFromForm();
        const officer = this.createFromForm();
        officer.avatarUrl = res.toString();
        this.accountService.save(settingsAccount).subscribe(
          () => {
            this.error = null;
            this.success = 'OK';
          },
          () => {
            this.success = null;
            this.error = 'ERROR';
          }
        );
        if (officer.id !== undefined) {
          this.subscribeToSaveResponse(this.officerService.update(officer));
        } else {
          this.subscribeToSaveResponse(this.officerService.create(officer));
        }
      });
    } else {
      const settingsAccount = this.accountFromForm();
      const officer = this.createFromForm();
      this.accountService.save(settingsAccount).subscribe(
        () => {
          this.error = null;
          this.success = 'OK';
        },
        () => {
          this.success = null;
          this.error = 'ERROR';
        }
      );
      if (officer.id !== undefined) {
        this.subscribeToSaveResponse(this.officerService.update(officer));
      } else {
        this.subscribeToSaveResponse(this.officerService.create(officer));
      }
    }
  }
  private createFromForm(): IOfficer {
    const entity = {
      ...new Officer(),
      id: this.officer.id,
      code: this.officer.code,
      fullName: this.settingsForm.get(['lastName']).value + ' ' + this.settingsForm.get('firstName').value,
      avatarUrl: this.settingsForm.get(['imageUrl']).value,
      vNUEmail: this.settingsForm.get(['VNUemail']).value,
      degree: this.settingsForm.get(['degree']).value,
      type: this.settingsForm.get(['type']).value,
      user: this.officer.user,
      unit: this.settingsForm.get(['unit']).value
    };
    return entity;
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
    const account = this.officer.user;
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
      degree: this.officer.degree,
      VNUemail: this.officer.vNUEmail
    });
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOfficer>>) {
    result.subscribe((res: HttpResponse<IOfficer>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }
  protected onSaveSuccess() {
    this.isSaving = false;
    this.loadAll();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'image/1';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task
      .snapshotChanges()
      .pipe(finalize(() => (this.downloadURL = fileRef.getDownloadURL())))
      .subscribe();
  }
}
