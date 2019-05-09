/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { OfficerManagementTestModule } from '../../../test.module';
import { DiaryDeleteDialogComponent } from 'app/entities/diary/diary-delete-dialog.component';
import { DiaryService } from 'app/entities/diary/diary.service';

describe('Component Tests', () => {
  describe('Diary Management Delete Component', () => {
    let comp: DiaryDeleteDialogComponent;
    let fixture: ComponentFixture<DiaryDeleteDialogComponent>;
    let service: DiaryService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [DiaryDeleteDialogComponent]
      })
        .overrideTemplate(DiaryDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DiaryDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(DiaryService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
