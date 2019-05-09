/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OfficerManagementTestModule } from '../../../test.module';
import { UnitComponent } from 'app/entities/unit/unit.component';
import { UnitService } from 'app/entities/unit/unit.service';
import { Unit } from 'app/shared/model/unit.model';

describe('Component Tests', () => {
  describe('Unit Management Component', () => {
    let comp: UnitComponent;
    let fixture: ComponentFixture<UnitComponent>;
    let service: UnitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [UnitComponent],
        providers: []
      })
        .overrideTemplate(UnitComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UnitComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(UnitService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Unit(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.units[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
