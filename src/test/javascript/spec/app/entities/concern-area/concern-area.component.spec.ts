/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OfficerManagementTestModule } from '../../../test.module';
import { ConcernAreaComponent } from 'app/entities/concern-area/concern-area.component';
import { ConcernAreaService } from 'app/entities/concern-area/concern-area.service';
import { ConcernArea } from 'app/shared/model/concern-area.model';

describe('Component Tests', () => {
  describe('ConcernArea Management Component', () => {
    let comp: ConcernAreaComponent;
    let fixture: ComponentFixture<ConcernAreaComponent>;
    let service: ConcernAreaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [ConcernAreaComponent],
        providers: []
      })
        .overrideTemplate(ConcernAreaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConcernAreaComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ConcernAreaService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ConcernArea(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.concernAreas[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
