import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IConcernArea, ConcernArea } from 'app/shared/model/concern-area.model';
import { ConcernAreaService } from './concern-area.service';
import { IOfficer } from 'app/shared/model/officer.model';
import { OfficerService } from 'app/entities/officer';

@Component({
  selector: 'jhi-concern-area-update',
  templateUrl: './concern-area-update.component.html'
})
export class ConcernAreaUpdateComponent implements OnInit {
  concernArea: IConcernArea;
  isSaving: boolean;

  officers: IOfficer[];

  editForm = this.fb.group({
    id: [],
    name: [],
    description: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected concernAreaService: ConcernAreaService,
    protected officerService: OfficerService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ concernArea }) => {
      this.updateForm(concernArea);
      this.concernArea = concernArea;
    });
    this.officerService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IOfficer[]>) => mayBeOk.ok),
        map((response: HttpResponse<IOfficer[]>) => response.body)
      )
      .subscribe((res: IOfficer[]) => (this.officers = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(concernArea: IConcernArea) {
    this.editForm.patchValue({
      id: concernArea.id,
      name: concernArea.name,
      description: concernArea.description
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        if (isImage && !/^image\//.test(file.type)) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      () => console.log('blob added'), // sucess
      this.onError
    );
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const concernArea = this.createFromForm();
    if (concernArea.id !== undefined) {
      this.subscribeToSaveResponse(this.concernAreaService.update(concernArea));
    } else {
      this.subscribeToSaveResponse(this.concernAreaService.create(concernArea));
    }
  }

  private createFromForm(): IConcernArea {
    const entity = {
      ...new ConcernArea(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      description: this.editForm.get(['description']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConcernArea>>) {
    result.subscribe((res: HttpResponse<IConcernArea>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
