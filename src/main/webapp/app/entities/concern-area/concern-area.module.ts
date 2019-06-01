import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';
import { TableModule } from 'primeng/table';

import { OfficerManagementSharedModule } from 'app/shared';
import {
  ConcernAreaComponent,
  ConcernAreaDetailComponent,
  ConcernAreaUpdateComponent,
  ConcernAreaDeletePopupComponent,
  ConcernAreaDeleteDialogComponent,
  concernAreaRoute,
  concernAreaPopupRoute
} from './';

const ENTITY_STATES = [...concernAreaRoute, ...concernAreaPopupRoute];

@NgModule({
  imports: [OfficerManagementSharedModule, RouterModule.forChild(ENTITY_STATES),    TableModule],
  declarations: [
    ConcernAreaComponent,
    ConcernAreaDetailComponent,
    ConcernAreaUpdateComponent,
    ConcernAreaDeleteDialogComponent,
    ConcernAreaDeletePopupComponent,

  ],
  entryComponents: [ConcernAreaComponent, ConcernAreaUpdateComponent, ConcernAreaDeleteDialogComponent, ConcernAreaDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficerManagementConcernAreaModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
