import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalSigningComponent } from './digital-signing/digital-signing.component';
import { DocumentCenterComponent } from './document-center/document-center.component';
import { NewDoucumentComponent } from './new-doucument/new-doucument.component';
import { OutboxComponent } from './outbox/outbox.component';
import { RepositoryComponent } from './repository/repository.component';

const routes: Routes = [
  {
    path:'user-management',
    loadChildren: () => import('./user-management/user-management.module').then( m => m.UserManagementModule)
  },
  {
    path:'repository',
    component:RepositoryComponent
  },
  {
    path:'outbox',
    component:OutboxComponent
  },
  {
    path:'dashboard',
    component:DocumentCenterComponent
  },
  {
    path:'document',
    component:NewDoucumentComponent
  },
  {
    path:'sign',
    component:DigitalSigningComponent
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
