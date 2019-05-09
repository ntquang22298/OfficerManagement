/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { OfficerManagementTestModule } from '../../../test.module';
import { DiaryUpdateComponent } from 'app/entities/diary/diary-update.component';
import { DiaryService } from 'app/entities/diary/diary.service';
import { Diary } from 'app/shared/model/diary.model';

describe('Component Tests', () => {
  describe('Diary Management Update Component', () => {
    let comp: DiaryUpdateComponent;
    let fixture: ComponentFixture<DiaryUpdateComponent>;
    let service: DiaryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [DiaryUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(DiaryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DiaryUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DiaryService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Diary(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Diary();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
