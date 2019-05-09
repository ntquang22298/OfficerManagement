/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfficerManagementTestModule } from '../../../test.module';
import { OfficerDetailComponent } from 'app/entities/officer/officer-detail.component';
import { Officer } from 'app/shared/model/officer.model';

describe('Component Tests', () => {
  describe('Officer Management Detail Component', () => {
    let comp: OfficerDetailComponent;
    let fixture: ComponentFixture<OfficerDetailComponent>;
    const route = ({ data: of({ officer: new Officer(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [OfficerDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(OfficerDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OfficerDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.officer).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
