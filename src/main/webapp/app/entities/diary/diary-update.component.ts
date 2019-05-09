import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { IDiary, Diary } from 'app/shared/model/diary.model';
import { DiaryService } from './diary.service';
import { IOfficer } from 'app/shared/model/officer.model';
import { OfficerService } from 'app/entities/officer';

@Component({
  selector: 'jhi-diary-update',
  templateUrl: './diary-update.component.html'
})
export class DiaryUpdateComponent implements OnInit {
  diary: IDiary;
  isSaving: boolean;

  officers: IOfficer[];

  editForm = this.fb.group({
    id: [],
    time: [],
    content: [],
    officer: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected diaryService: DiaryService,
    protected officerService: OfficerService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ diary }) => {
      this.updateForm(diary);
      this.diary = diary;
    });
    this.officerService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IOfficer[]>) => mayBeOk.ok),
        map((response: HttpResponse<IOfficer[]>) => response.body)
      )
      .subscribe((res: IOfficer[]) => (this.officers = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(diary: IDiary) {
    this.editForm.patchValue({
      id: diary.id,
      time: diary.time != null ? diary.time.format(DATE_TIME_FORMAT) : null,
      content: diary.content,
      officer: diary.officer
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const diary = this.createFromForm();
    if (diary.id !== undefined) {
      this.subscribeToSaveResponse(this.diaryService.update(diary));
    } else {
      this.subscribeToSaveResponse(this.diaryService.create(diary));
    }
  }

  private createFromForm(): IDiary {
    const entity = {
      ...new Diary(),
      id: this.editForm.get(['id']).value,
      time: this.editForm.get(['time']).value != null ? moment(this.editForm.get(['time']).value, DATE_TIME_FORMAT) : undefined,
      content: this.editForm.get(['content']).value,
      officer: this.editForm.get(['officer']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiary>>) {
    result.subscribe((res: HttpResponse<IDiary>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
}
