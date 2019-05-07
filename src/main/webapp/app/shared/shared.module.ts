import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  OfficerManagementSharedLibsModule,
  OfficerManagementSharedCommonModule,
  JhiLoginModalComponent,
  HasAnyAuthorityDirective
} from './';

@NgModule({
  imports: [OfficerManagementSharedLibsModule, OfficerManagementSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [OfficerManagementSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficerManagementSharedModule {
  static forRoot() {
    return {
      ngModule: OfficerManagementSharedModule
    };
  }
}
