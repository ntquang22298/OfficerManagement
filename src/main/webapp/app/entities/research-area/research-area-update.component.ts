import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IResearchArea, ResearchArea } from 'app/shared/model/research-area.model';
import { ResearchAreaService } from './research-area.service';
import { IOfficer } from 'app/shared/model/officer.model';
import { OfficerService } from 'app/entities/officer';

@Component({
  selector: 'jhi-research-area-update',
  templateUrl: './research-area-update.component.html'
})
export class ResearchAreaUpdateComponent implements OnInit {
  researchArea: IResearchArea;
  isSaving: boolean;

  researchareas: IResearchArea[];

  officers: IOfficer[];

  editForm = this.fb.group({
    id: [],
    name: [],
    parent: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected researchAreaService: ResearchAreaService,
    protected officerService: OfficerService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ researchArea }) => {
      this.updateForm(researchArea);
      this.researchArea = researchArea;
    });
    this.researchAreaService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IResearchArea[]>) => mayBeOk.ok),
        map((response: HttpResponse<IResearchArea[]>) => response.body)
      )
      .subscribe((res: IResearchArea[]) => (this.researchareas = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.officerService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IOfficer[]>) => mayBeOk.ok),
        map((response: HttpResponse<IOfficer[]>) => response.body)
      )
      .subscribe((res: IOfficer[]) => (this.officers = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(researchArea: IResearchArea) {
    this.editForm.patchValue({
      id: researchArea.id,
      name: researchArea.name,
      parent: researchArea.parent
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const researchArea = this.createFromForm();
    if (researchArea.id !== undefined) {
      this.subscribeToSaveResponse(this.researchAreaService.update(researchArea));
    } else {
      this.subscribeToSaveResponse(this.researchAreaService.create(researchArea));
    }
  }

  private createFromForm(): IResearchArea {
    const entity = {
      ...new ResearchArea(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      parent: this.editForm.get(['parent']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResearchArea>>) {
    result.subscribe((res: HttpResponse<IResearchArea>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackResearchAreaById(index: number, item: IResearchArea) {
    return item.id;
  }

  trackOfficerById(index: number, item: IOfficer) {
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
