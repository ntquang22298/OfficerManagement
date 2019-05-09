/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { OfficerManagementTestModule } from '../../../test.module';
import { OfficerUpdateComponent } from 'app/entities/officer/officer-update.component';
import { OfficerService } from 'app/entities/officer/officer.service';
import { Officer } from 'app/shared/model/officer.model';

describe('Component Tests', () => {
  describe('Officer Management Update Component', () => {
    let comp: OfficerUpdateComponent;
    let fixture: ComponentFixture<OfficerUpdateComponent>;
    let service: OfficerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [OfficerUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(OfficerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OfficerUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OfficerService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Officer(123);
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
        const entity = new Officer();
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
