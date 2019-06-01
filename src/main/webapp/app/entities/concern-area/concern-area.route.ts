import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ConcernArea } from 'app/shared/model/concern-area.model';
import { ConcernAreaService } from './concern-area.service';
import { ConcernAreaComponent } from './concern-area.component';
import { ConcernAreaDetailComponent } from './concern-area-detail.component';
import { ConcernAreaUpdateComponent } from './concern-area-update.component';
import { ConcernAreaDeletePopupComponent } from './concern-area-delete-dialog.component';
import { IConcernArea } from 'app/shared/model/concern-area.model';

@Injectable({ providedIn: 'root' })
export class ConcernAreaResolve implements Resolve<IConcernArea> {
  constructor(private service: ConcernAreaService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IConcernArea> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ConcernArea>) => response.ok),
        map((concernArea: HttpResponse<ConcernArea>) => concernArea.body)
      );
    }
    return of(new ConcernArea());
  }
}

export const concernAreaRoute: Routes = [
  {
    path: '',
    component: ConcernAreaComponent,
    data: {
      authorities: [],
      pageTitle: 'officerManagementApp.concernArea.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ConcernAreaDetailComponent,
    resolve: {
      concernArea: ConcernAreaResolve
    },
    data: {
      authorities: [],
      pageTitle: 'officerManagementApp.concernArea.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ConcernAreaUpdateComponent,
    resolve: {
      concernArea: ConcernAreaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'officerManagementApp.concernArea.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ConcernAreaUpdateComponent,
    resolve: {
      concernArea: ConcernAreaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'officerManagementApp.concernArea.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const concernAreaPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ConcernAreaDeletePopupComponent,
    resolve: {
      concernArea: ConcernAreaResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'officerManagementApp.concernArea.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
