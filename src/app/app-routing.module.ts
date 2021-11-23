import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginslideComponent } from './loginslide/loginslide.component';

const routes: Routes = [
  {
    path:'',
    component:LoginslideComponent
  },
  {
    path:'login',
    component:LoginslideComponent
  },
  {
    path:'home',
    component:DashboardComponent
  },
  {
    path:'page',
    loadChildren: () => import('./page/page.module').then( m => m.PageModule)
  },
  // {
  //   path:'**',
  //   redirectTo:'auth/login'
  // }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {​​​​​​​ preloadingStrategy: PreloadAllModules, useHash: true }​​​​​​​)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
