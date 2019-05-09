/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfficerManagementTestModule } from '../../../test.module';
import { ResearchAreaDetailComponent } from 'app/entities/research-area/research-area-detail.component';
import { ResearchArea } from 'app/shared/model/research-area.model';

describe('Component Tests', () => {
  describe('ResearchArea Management Detail Component', () => {
    let comp: ResearchAreaDetailComponent;
    let fixture: ComponentFixture<ResearchAreaDetailComponent>;
    const route = ({ data: of({ researchArea: new ResearchArea(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [ResearchAreaDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ResearchAreaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ResearchAreaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.researchArea).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
