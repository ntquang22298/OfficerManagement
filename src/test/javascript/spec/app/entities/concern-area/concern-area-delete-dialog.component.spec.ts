/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { OfficerManagementTestModule } from '../../../test.module';
import { ConcernAreaDeleteDialogComponent } from 'app/entities/concern-area/concern-area-delete-dialog.component';
import { ConcernAreaService } from 'app/entities/concern-area/concern-area.service';

describe('Component Tests', () => {
  describe('ConcernArea Management Delete Component', () => {
    let comp: ConcernAreaDeleteDialogComponent;
    let fixture: ComponentFixture<ConcernAreaDeleteDialogComponent>;
    let service: ConcernAreaService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [ConcernAreaDeleteDialogComponent]
      })
        .overrideTemplate(ConcernAreaDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ConcernAreaDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ConcernAreaService);
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
