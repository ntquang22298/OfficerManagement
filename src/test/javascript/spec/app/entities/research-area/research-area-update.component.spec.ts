/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { OfficerManagementTestModule } from '../../../test.module';
import { ResearchAreaUpdateComponent } from 'app/entities/research-area/research-area-update.component';
import { ResearchAreaService } from 'app/entities/research-area/research-area.service';
import { ResearchArea } from 'app/shared/model/research-area.model';

describe('Component Tests', () => {
  describe('ResearchArea Management Update Component', () => {
    let comp: ResearchAreaUpdateComponent;
    let fixture: ComponentFixture<ResearchAreaUpdateComponent>;
    let service: ResearchAreaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [ResearchAreaUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ResearchAreaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResearchAreaUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResearchAreaService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ResearchArea(123);
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
        const entity = new ResearchArea();
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
