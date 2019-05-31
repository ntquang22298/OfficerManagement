import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { OfficerManagementSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { PanelModule } from 'primeng/panel';

@NgModule({
  imports: [OfficerManagementSharedModule, RouterModule.forChild([HOME_ROUTE]), DataViewModule, PanelModule],
  declarations: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficerManagementHomeModule {}
