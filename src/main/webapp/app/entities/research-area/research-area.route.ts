import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ResearchArea } from 'app/shared/model/research-area.model';
import { ResearchAreaService } from './research-area.service';
import { ResearchAreaComponent } from './research-area.component';
import { ResearchAreaDetailComponent } from './research-area-detail.component';
import { ResearchAreaUpdateComponent } from './research-area-update.component';
import { ResearchAreaDeletePopupComponent } from './research-area-delete-dialog.component';
import { IResearchArea } from 'app/shared/model/research-area.model';

@Injectable({ providedIn: 'root' })
export class ResearchAreaResolve implements Resolve<IResearchArea> {
  constructor(private service: ResearchAreaService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IResearchArea> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ResearchArea>) => response.ok),
        map((researchArea: HttpResponse<ResearchArea>) => researchArea.body)
      );
    }
    return of(new ResearchArea());
  }
}

export const researchAreaRoute: Routes = [
  {
    path: '',
    component: ResearchAreaComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'officerManagementApp.researchArea.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ResearchAreaDetailComponent,
    resolve: {
      researchArea: ResearchAreaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'officerManagementApp.researchArea.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ResearchAreaUpdateComponent,
    resolve: {
      researchArea: ResearchAreaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'officerManagementApp.researchArea.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ResearchAreaUpdateComponent,
    resolve: {
      researchArea: ResearchAreaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'officerManagementApp.researchArea.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const researchAreaPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ResearchAreaDeletePopupComponent,
    resolve: {
      researchArea: ResearchAreaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'officerManagementApp.researchArea.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
