import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { OfficerManagementSharedModule } from 'app/shared';
import {
  DiaryComponent,
  DiaryDetailComponent,
  DiaryUpdateComponent,
  DiaryDeletePopupComponent,
  DiaryDeleteDialogComponent,
  diaryRoute,
  diaryPopupRoute
} from './';

const ENTITY_STATES = [...diaryRoute, ...diaryPopupRoute];

@NgModule({
  imports: [OfficerManagementSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [DiaryComponent, DiaryDetailComponent, DiaryUpdateComponent, DiaryDeleteDialogComponent, DiaryDeletePopupComponent],
  entryComponents: [DiaryComponent, DiaryUpdateComponent, DiaryDeleteDialogComponent, DiaryDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficerManagementDiaryModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
