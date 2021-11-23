import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuAppComponent } from './menu-app/menu-app.component';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: 'menu-app',
    component: MenuAppComponent
  },
  {
    path: 'role',
    component: RoleComponent
  },
  {
    path: 'user',
    component: UserComponent
  },
  {
    path: '**',
    redirectTo: 'menu-app'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
