import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';
import { TableModule } from 'primeng/table';
import { OfficerManagementSharedModule } from 'app/shared';
import { PaginatorModule } from 'primeng/paginator';
import {
  UnitComponent,
  UnitDetailComponent,
  UnitUpdateComponent,
  UnitDeletePopupComponent,
  UnitDeleteDialogComponent,
  unitRoute,
  unitPopupRoute
} from './';

const ENTITY_STATES = [...unitRoute, ...unitPopupRoute];

@NgModule({
  imports: [OfficerManagementSharedModule, RouterModule.forChild(ENTITY_STATES), TableModule, PaginatorModule],
  declarations: [UnitComponent, UnitDetailComponent, UnitUpdateComponent, UnitDeleteDialogComponent, UnitDeletePopupComponent],
  entryComponents: [UnitComponent, UnitUpdateComponent, UnitDeleteDialogComponent, UnitDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficerManagementUnitModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
