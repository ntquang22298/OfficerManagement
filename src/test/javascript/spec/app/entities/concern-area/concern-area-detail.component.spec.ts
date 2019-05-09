/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfficerManagementTestModule } from '../../../test.module';
import { ConcernAreaDetailComponent } from 'app/entities/concern-area/concern-area-detail.component';
import { ConcernArea } from 'app/shared/model/concern-area.model';

describe('Component Tests', () => {
  describe('ConcernArea Management Detail Component', () => {
    let comp: ConcernAreaDetailComponent;
    let fixture: ComponentFixture<ConcernAreaDetailComponent>;
    const route = ({ data: of({ concernArea: new ConcernArea(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [ConcernAreaDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ConcernAreaDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ConcernAreaDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.concernArea).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
