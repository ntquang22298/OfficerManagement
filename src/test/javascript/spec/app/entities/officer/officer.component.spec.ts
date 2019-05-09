/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OfficerManagementTestModule } from '../../../test.module';
import { OfficerComponent } from 'app/entities/officer/officer.component';
import { OfficerService } from 'app/entities/officer/officer.service';
import { Officer } from 'app/shared/model/officer.model';

describe('Component Tests', () => {
  describe('Officer Management Component', () => {
    let comp: OfficerComponent;
    let fixture: ComponentFixture<OfficerComponent>;
    let service: OfficerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [OfficerComponent],
        providers: []
      })
        .overrideTemplate(OfficerComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OfficerComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OfficerService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Officer(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.officers[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
