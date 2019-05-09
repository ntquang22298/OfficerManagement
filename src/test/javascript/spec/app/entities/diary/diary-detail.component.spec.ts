/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OfficerManagementTestModule } from '../../../test.module';
import { DiaryDetailComponent } from 'app/entities/diary/diary-detail.component';
import { Diary } from 'app/shared/model/diary.model';

describe('Component Tests', () => {
  describe('Diary Management Detail Component', () => {
    let comp: DiaryDetailComponent;
    let fixture: ComponentFixture<DiaryDetailComponent>;
    const route = ({ data: of({ diary: new Diary(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [DiaryDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(DiaryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DiaryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.diary).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
