import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IDiary } from 'app/shared/model/diary.model';
import { DiaryService } from './diary.service';

@Component({
  selector: 'jhi-diary-delete-dialog',
  templateUrl: './diary-delete-dialog.component.html'
})
export class DiaryDeleteDialogComponent {
  diary: IDiary;

  constructor(protected diaryService: DiaryService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.diaryService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'diaryListModification',
        content: 'Deleted an diary'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-diary-delete-popup',
  template: ''
})
export class DiaryDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ diary }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(DiaryDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.diary = diary;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/diary', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/diary', { outlets: { popup: null } }]);
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
