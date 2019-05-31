import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IUnit, Unit } from 'app/shared/model/unit.model';
import { UnitService } from './unit.service';

@Component({
  selector: 'jhi-unit-update',
  templateUrl: './unit-update.component.html',
  styleUrls : ['unit-update.scss']
})
export class UnitUpdateComponent implements OnInit {
  unit: IUnit;
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [],
    address: [],
    phone: [],
    website: [],
    type: []
  });

  constructor(protected unitService: UnitService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ unit }) => {
      this.updateForm(unit);
      this.unit = unit;
    });
  }

  updateForm(unit: IUnit) {
    this.editForm.patchValue({
      id: unit.id,
      name: unit.name,
      address: unit.address,
      phone: unit.phone,
      website: unit.website,
      type: unit.type
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const unit = this.createFromForm();
    if (unit.id !== undefined) {
      this.subscribeToSaveResponse(this.unitService.update(unit));
    } else {
      this.subscribeToSaveResponse(this.unitService.create(unit));
    }
  }

  private createFromForm(): IUnit {
    const entity = {
      ...new Unit(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      address: this.editForm.get(['address']).value,
      phone: this.editForm.get(['phone']).value,
      website: this.editForm.get(['website']).value,
      type: this.editForm.get(['type']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUnit>>) {
    result.subscribe((res: HttpResponse<IUnit>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
