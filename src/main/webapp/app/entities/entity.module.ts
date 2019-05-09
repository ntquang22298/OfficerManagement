import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'unit',
        loadChildren: './unit/unit.module#OfficerManagementUnitModule'
      },
      {
        path: 'officer',
        loadChildren: './officer/officer.module#OfficerManagementOfficerModule'
      },
      {
        path: 'research-area',
        loadChildren: './research-area/research-area.module#OfficerManagementResearchAreaModule'
      },
      {
        path: 'concern-area',
        loadChildren: './concern-area/concern-area.module#OfficerManagementConcernAreaModule'
      },
      {
        path: 'diary',
        loadChildren: './diary/diary.module#OfficerManagementDiaryModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficerManagementEntityModule {}
