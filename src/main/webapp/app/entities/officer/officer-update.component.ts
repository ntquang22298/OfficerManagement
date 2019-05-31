import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IOfficer, Officer } from 'app/shared/model/officer.model';
import { OfficerService } from './officer.service';
import { IUser, UserService } from 'app/core';
import { IResearchArea } from 'app/shared/model/research-area.model';
import { ResearchAreaService } from 'app/entities/research-area';
import { IConcernArea } from 'app/shared/model/concern-area.model';
import { ConcernAreaService } from 'app/entities/concern-area';
import { IUnit } from 'app/shared/model/unit.model';
import { UnitService } from 'app/entities/unit';

@Component({
  selector: 'jhi-officer-update',
  templateUrl: './officer-update.component.html'
})
export class OfficerUpdateComponent implements OnInit {
  officer: IOfficer;
  isSaving: boolean;

  users: IUser[];

  researchareas: IResearchArea[];

  concernareas: IConcernArea[];

  units: IUnit[];

  editForm = this.fb.group({
    id: [],
    code: [],
    fullName: [],
    avatarUrl: [],
    vNUEmail: [],
    degree: [],
    type: [],
    user: [],
    researchAreas: [],
    concernAreas: [],
    unit: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected officerService: OfficerService,
    protected userService: UserService,
    protected researchAreaService: ResearchAreaService,
    protected concernAreaService: ConcernAreaService,
    protected unitService: UnitService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ officer }) => {
      this.updateForm(officer);
      this.officer = officer;
    });
    this.userService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUser[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUser[]>) => response.body)
      )
      .subscribe((res: IUser[]) => (this.users = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.researchAreaService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IResearchArea[]>) => mayBeOk.ok),
        map((response: HttpResponse<IResearchArea[]>) => response.body)
      )
      .subscribe((res: IResearchArea[]) => (this.researchareas = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.concernAreaService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IConcernArea[]>) => mayBeOk.ok),
        map((response: HttpResponse<IConcernArea[]>) => response.body)
      )
      .subscribe((res: IConcernArea[]) => (this.concernareas = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.unitService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUnit[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUnit[]>) => response.body)
      )
      .subscribe((res: IUnit[]) => (this.units = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(officer: IOfficer) {
    this.editForm.patchValue({
      id: officer.id,
      code: officer.code,
      fullName: officer.fullName,
      avatarUrl: officer.avatarUrl,
      vNUEmail: officer.vNUEmail,
      degree: officer.degree,
      type: officer.type,
      user: officer.user,
      researchAreas: officer.researchAreas,
      concernAreas: officer.concernAreas,
      unit: officer.unit
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const officer = this.createFromForm();
    console.log(this.officer.researchAreas);
    if (officer.id !== undefined) {
      this.subscribeToSaveResponse(this.officerService.update(officer));
    } else {
      this.subscribeToSaveResponse(this.officerService.create(officer));
    }
  }

  private createFromForm(): IOfficer {
    const entity = {
      ...new Officer(),
      id: this.editForm.get(['id']).value,
      code: this.editForm.get(['code']).value,
      fullName: this.editForm.get(['fullName']).value,
      avatarUrl: this.editForm.get(['avatarUrl']).value,
      vNUEmail: this.editForm.get(['vNUEmail']).value,
      degree: this.editForm.get(['degree']).value,
      type: this.editForm.get(['type']).value,
      user: this.editForm.get(['user']).value,
      researchAreas: this.editForm.get(['researchAreas']).value,
      concernAreas: this.editForm.get(['concernAreas']).value,
      unit: this.editForm.get(['unit']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOfficer>>) {
    result.subscribe((res: HttpResponse<IOfficer>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackUserById(index: number, item: IUser) {
    return item.id;
  }

  trackResearchAreaById(index: number, item: IResearchArea) {
    return item.id;
  }

  trackConcernAreaById(index: number, item: IConcernArea) {
    return item.id;
  }

  trackUnitById(index: number, item: IUnit) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
