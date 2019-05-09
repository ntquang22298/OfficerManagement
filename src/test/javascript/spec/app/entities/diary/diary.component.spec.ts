/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OfficerManagementTestModule } from '../../../test.module';
import { DiaryComponent } from 'app/entities/diary/diary.component';
import { DiaryService } from 'app/entities/diary/diary.service';
import { Diary } from 'app/shared/model/diary.model';

describe('Component Tests', () => {
  describe('Diary Management Component', () => {
    let comp: DiaryComponent;
    let fixture: ComponentFixture<DiaryComponent>;
    let service: DiaryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [DiaryComponent],
        providers: []
      })
        .overrideTemplate(DiaryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DiaryComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DiaryService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Diary(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.diaries[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
