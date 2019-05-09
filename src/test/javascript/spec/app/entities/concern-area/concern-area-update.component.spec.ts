/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { OfficerManagementTestModule } from '../../../test.module';
import { ConcernAreaUpdateComponent } from 'app/entities/concern-area/concern-area-update.component';
import { ConcernAreaService } from 'app/entities/concern-area/concern-area.service';
import { ConcernArea } from 'app/shared/model/concern-area.model';

describe('Component Tests', () => {
  describe('ConcernArea Management Update Component', () => {
    let comp: ConcernAreaUpdateComponent;
    let fixture: ComponentFixture<ConcernAreaUpdateComponent>;
    let service: ConcernAreaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [ConcernAreaUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ConcernAreaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConcernAreaUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ConcernAreaService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ConcernArea(123);
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
        const entity = new ConcernArea();
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
