import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Officer } from 'app/shared/model/officer.model';
import { OfficerService } from './officer.service';
import { OfficerComponent } from './officer.component';
import { OfficerDetailComponent } from './officer-detail.component';
import { OfficerUpdateComponent } from './officer-update.component';
import { OfficerDeletePopupComponent } from './officer-delete-dialog.component';
import { IOfficer } from 'app/shared/model/officer.model';

@Injectable({ providedIn: 'root' })
export class OfficerResolve implements Resolve<IOfficer> {
  constructor(private service: OfficerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IOfficer> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Officer>) => response.ok),
        map((officer: HttpResponse<Officer>) => officer.body)
      );
    }
    return of(new Officer());
  }
}

export const officerRoute: Routes = [
  {
    path: '',
    component: OfficerComponent,
    data: {
      authorities: ['ROLE_USER', 'ROLE_ANONYMOUS'],
      pageTitle: 'officerManagementApp.officer.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: OfficerDetailComponent,
    resolve: {
      officer: OfficerResolve
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_ANONYMOUS'],
      pageTitle: 'officerManagementApp.officer.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: OfficerUpdateComponent,
    resolve: {
      officer: OfficerResolve
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_ANONYMOUS'],
      pageTitle: 'officerManagementApp.officer.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: OfficerUpdateComponent,
    resolve: {
      officer: OfficerResolve
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_ANONYMOUS'],
      pageTitle: 'officerManagementApp.officer.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const officerPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: OfficerDeletePopupComponent,
    resolve: {
      officer: OfficerResolve
    },
    data: {
      authorities: ['ROLE_USER', 'ROLE_ANONYMOUS'],
      pageTitle: 'officerManagementApp.officer.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
