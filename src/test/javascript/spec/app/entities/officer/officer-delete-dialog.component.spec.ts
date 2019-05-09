/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { OfficerManagementTestModule } from '../../../test.module';
import { OfficerDeleteDialogComponent } from 'app/entities/officer/officer-delete-dialog.component';
import { OfficerService } from 'app/entities/officer/officer.service';

describe('Component Tests', () => {
  describe('Officer Management Delete Component', () => {
    let comp: OfficerDeleteDialogComponent;
    let fixture: ComponentFixture<OfficerDeleteDialogComponent>;
    let service: OfficerService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [OfficerManagementTestModule],
        declarations: [OfficerDeleteDialogComponent]
      })
        .overrideTemplate(OfficerDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OfficerDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(OfficerService);
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
