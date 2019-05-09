/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OfficerManagementTestModule } from '../../../test.module';
import { ResearchAreaComponent } from 'app/entities/research-area/research-area.component';
import { ResearchAreaService } from 'app/entities/research-area/research-area.service';
import { ResearchArea } from 'app/shared/model/research-area.model';

describe('Component Tests', () => {
  describe('ResearchArea Management Component', () => {
    let comp: ResearchAreaComponent;
    let fixture: ComponentFixture<ResearchAreaComponent>;
    let service: ResearchAreaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [ResearchAreaComponent],
        providers: []
      })
        .overrideTemplate(ResearchAreaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ResearchAreaComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ResearchAreaService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ResearchArea(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.researchAreas[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
