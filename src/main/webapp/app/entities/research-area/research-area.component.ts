import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IResearchArea } from 'app/shared/model/research-area.model';
import { AccountService } from 'app/core';
import { ResearchAreaService } from './research-area.service';

@Component({
  selector: 'jhi-research-area',
  templateUrl: './research-area.component.html'
})
export class ResearchAreaComponent implements OnInit, OnDestroy {
  researchAreas: IResearchArea[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected researchAreaService: ResearchAreaService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.researchAreaService
      .query()
      .pipe(
        filter((res: HttpResponse<IResearchArea[]>) => res.ok),
        map((res: HttpResponse<IResearchArea[]>) => res.body)
      )
      .subscribe(
        (res: IResearchArea[]) => {
          this.researchAreas = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInResearchAreas();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IResearchArea) {
    return item.id;
  }

  registerChangeInResearchAreas() {
    this.eventSubscriber = this.eventManager.subscribe('researchAreaListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
