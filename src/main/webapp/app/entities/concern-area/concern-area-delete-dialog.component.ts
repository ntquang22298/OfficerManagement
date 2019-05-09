import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IConcernArea } from 'app/shared/model/concern-area.model';
import { ConcernAreaService } from './concern-area.service';

@Component({
  selector: 'jhi-concern-area-delete-dialog',
  templateUrl: './concern-area-delete-dialog.component.html'
})
export class ConcernAreaDeleteDialogComponent {
  concernArea: IConcernArea;

  constructor(
    protected concernAreaService: ConcernAreaService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.concernAreaService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'concernAreaListModification',
        content: 'Deleted an concernArea'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-concern-area-delete-popup',
  template: ''
})
export class ConcernAreaDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ concernArea }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ConcernAreaDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.concernArea = concernArea;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/concern-area', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/concern-area', { outlets: { popup: null } }]);
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
