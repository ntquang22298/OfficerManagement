import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { OfficerManagementSharedModule } from 'app/shared';
import {
  ResearchAreaComponent,
  ResearchAreaDetailComponent,
  ResearchAreaUpdateComponent,
  ResearchAreaDeletePopupComponent,
  ResearchAreaDeleteDialogComponent,
  researchAreaRoute,
  researchAreaPopupRoute
} from './';

const ENTITY_STATES = [...researchAreaRoute, ...researchAreaPopupRoute];

@NgModule({
  imports: [OfficerManagementSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ResearchAreaComponent,
    ResearchAreaDetailComponent,
    ResearchAreaUpdateComponent,
    ResearchAreaDeleteDialogComponent,
    ResearchAreaDeletePopupComponent
  ],
  entryComponents: [
    ResearchAreaComponent,
    ResearchAreaUpdateComponent,
    ResearchAreaDeleteDialogComponent,
    ResearchAreaDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficerManagementResearchAreaModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
