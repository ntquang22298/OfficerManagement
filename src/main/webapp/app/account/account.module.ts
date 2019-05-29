import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { OfficerManagementSharedModule } from 'app/shared';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from 'primeng/tree';
import { CheckboxModule } from 'primeng/checkbox';
import {
  PasswordStrengthBarComponent,
  RegisterComponent,
  ActivateComponent,
  PasswordComponent,
  PasswordResetInitComponent,
  PasswordResetFinishComponent,
  SettingsComponent,
  accountState
} from './';

@NgModule({
  imports: [
    OfficerManagementSharedModule,
    RouterModule.forChild(accountState),
    TabViewModule,
    TreeModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDGu5dDzNB1RbUS-lU6WvL51s8jc1BYjpc',
      authDomain: 'vuejs-firebase-425c6.firebaseapp.com',
      databaseURL: 'https://vuejs-firebase-425c6.firebaseio.com',
      projectId: 'vuejs-firebase-425c6',
      storageBucket: 'vuejs-firebase-425c6.appspot.com',
      messagingSenderId: '1062324573032',
      appId: '1:1062324573032:web:74d74355b272f509'
    }),
    AngularFirestoreModule,
    AngularFireStorageModule,
    CheckboxModule
  ],
  declarations: [
    ActivateComponent,
    RegisterComponent,
    PasswordComponent,
    PasswordStrengthBarComponent,
    PasswordResetInitComponent,
    PasswordResetFinishComponent,
    SettingsComponent
  ],
  // providers: [
  //   { provide: StorageBucket, useValue: 'my-bucket-name' }
  // ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OfficerManagementAccountModule {}
