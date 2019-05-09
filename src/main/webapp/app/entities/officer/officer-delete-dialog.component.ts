import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOfficer } from 'app/shared/model/officer.model';
import { OfficerService } from './officer.service';

@Component({
  selector: 'jhi-officer-delete-dialog',
  templateUrl: './officer-delete-dialog.component.html'
})
export class OfficerDeleteDialogComponent {
  officer: IOfficer;

  constructor(protected officerService: OfficerService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.officerService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'officerListModification',
        content: 'Deleted an officer'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-officer-delete-popup',
  template: ''
})
export class OfficerDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ officer }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(OfficerDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.officer = officer;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/officer', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/officer', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
