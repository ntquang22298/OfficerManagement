import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IResearchArea } from 'app/shared/model/research-area.model';
import { ResearchAreaService } from './research-area.service';

@Component({
  selector: 'jhi-research-area-delete-dialog',
  templateUrl: './research-area-delete-dialog.component.html'
})
export class ResearchAreaDeleteDialogComponent {
  researchArea: IResearchArea;

  constructor(
    protected researchAreaService: ResearchAreaService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.researchAreaService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'researchAreaListModification',
        content: 'Deleted an researchArea'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-research-area-delete-popup',
  template: ''
})
export class ResearchAreaDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ researchArea }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(ResearchAreaDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.researchArea = researchArea;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/research-area', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/research-area', { outlets: { popup: null } }]);
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
