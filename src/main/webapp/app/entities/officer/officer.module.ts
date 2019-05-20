import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PaginatorModule } from 'primeng/paginator';
import { OfficerManagementSharedModule } from 'app/shared';
import {
  OfficerComponent,
  OfficerDetailComponent,
  OfficerUpdateComponent,
  OfficerDeletePopupComponent,
  OfficerDeleteDialogComponent,
  officerRoute,
  officerPopupRoute
} from './';

const ENTITY_STATES = [...officerRoute, ...officerPopupRoute];

@NgModule({
  imports: [OfficerManagementSharedModule, RouterModule.forChild(ENTITY_STATES), TableModule, AutoCompleteModule, PaginatorModule],
  declarations: [
    OfficerComponent,
    OfficerDetailComponent,
    OfficerUpdateComponent,
    OfficerDeleteDialogComponent,
    OfficerDeletePopupComponent
  ],
  entryComponents: [OfficerComponent, OfficerUpdateComponent, OfficerDeleteDialogComponent, OfficerDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficerManagementOfficerModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
