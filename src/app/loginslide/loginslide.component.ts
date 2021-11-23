import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { AuthenticationDetails, ChangePassword, EMailModel } from '../models/master';
import { NavItem } from '../models/navigation';
//import { NotificationSnackBarComponent } from 'notification/notification-snack-bar/notification-snack-bar';
//import { SnackBarStatus } from '../notification/notification-snack-bar/notification-snackbar-status-enum';
import { NotificationSnackBarComponent } from '../notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from '../notifications/snackbar-status-enum';
import { AuthService } from '../service/auth.service';
import { MenuUpdataionService } from '../service/menu-update.service';
import { FuseNavigationService } from '../service/navigation.service';

@Component({
  selector: 'app-loginslide',
  templateUrl: './loginslide.component.html',
  styleUrls: ['./loginslide.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginslideComponent implements OnInit {
  loginForm: FormGroup;
  navigation: NavItem[] = [];
  authenticationDetails: AuthenticationDetails;
  MenuItems: string[];
  children: NavItem[] = [];
  subChildren: NavItem[] = [];
  private _unsubscribeAll: Subject<any>;
  message = 'Snack Bar opened.';
  actionButtonLabel = 'Retry';
  action = true;
  setAutoHide = true;
  autoHide = 2000;
  hide: boolean = true;
  hiding: boolean;
  addExtraClass: false;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  IsProgressBarVisibile: boolean;
  username: any;
  password: any;

  constructor(
    private _fuseNavigationService: FuseNavigationService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _menuUpdationService: MenuUpdataionService,
    // private _loginService: LoginService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
    this.IsProgressBarVisibile = false;
  }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    this._authService.isLoggedin(false);
  }

  LoginClicked(): void {
    if (this.loginForm.valid) {
      this.spinner.show();
      this.username = this.loginForm.get('userName').value;
      this.password = this.loginForm.get('password').value;
      console.log(this.username, this.password)
      this._authService.login(this.username, this.password).subscribe(
        (data) => {
          this.IsProgressBarVisibile = false;
          const dat = data as AuthenticationDetails;
          // if (data.isChangePasswordRequired === 'Yes') {
          //   this.OpenChangePasswordDialog(dat);
          // } else {
          //   this.saveUserDetails(dat);
          // }
          this.spinner.hide();
          console.log("AuthResult", data);
          this.saveUserDetails(dat);
        },
        (err) => {
          this.spinner.hide();
          console.error(err);
          // console.log(err instanceof Object);
          this.notificationSnackBarComponent.openSnackBar(err instanceof Object ? 'Something went wrong' : err, SnackBarStatus.danger);
        }
      );
      // this._router.navigate(['dashboard']);
      // this.notificationSnackBarComponent.openSnackBar('Logged in successfully', SnackBarStatus.success);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const abstractControl: any = this.loginForm.get(key);
        abstractControl.markAsDirty();
      });
    }

  }

  saveUserDetails(data: AuthenticationDetails): void {
    localStorage.setItem('authorizationData', JSON.stringify(data));
    this.UpdateMenu();
    this.notificationSnackBarComponent.openSnackBar('Logged in successfully', SnackBarStatus.success);
    if (data.UserRole === 'User') {
      this._router.navigate(['page/dashboard']);
    }
    else if (data.UserRole === 'TempUser') {
      this._router.navigate(['page/dashboard']);
    }
    else if (data.UserRole === 'Support') {
      this._router.navigate(['page/user-management']);
    }
    else {
      this._router.navigate(['page/user-management']);
    }
  }

  UpdateMenu(): void {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      this.MenuItems = this.authenticationDetails.MenuItemNames.split(',');
      // console.log(this.MenuItems);
    } else {
    }
    if (this.MenuItems.indexOf('vsign-dashboard') >= 0) {
      this.children.push(
        {
          displayName: "Documents",
          icon: "assets/icons/Document_inactive.svg",
          icon_active: "assets/icons/Document_active.svg",
          route: 'page/dashboard',
          type: "main"
        }
      );
    }
    if (this.MenuItems.indexOf("Document_search") >= 0) {
      this.children.push({
        displayName: "Document Search",
        icon: "/assets/icons/search.svg",
        icon_active: "assets/icons/search_active.svg",
        route: '/page/models/dashboard',
        type: "main"
      });
    }
    if (this.MenuItems.indexOf("NewDocument") >= 0) {
      localStorage.removeItem("viewClient");
      localStorage.removeItem("fulfilmentSave")
      localStorage.removeItem("viewCompany");
      localStorage.removeItem("viewDocId");
      this.children.push({
        displayName: "New-Document",
        icon: "/assets/icons/newdocument.svg",
        icon_active: "/assets/icons/newdocument_active.svg",
        route: '/page/document',
        type: "main"
      });
    }

    if (this.MenuItems.indexOf('vsign-documents') >= 0) {
      this.children.push(
        {
          displayName: "Repository",
          icon: "/assets/icons/repository.svg",
          icon_active: "assets/icons/repository_active.svg",
          route: '/page/repository',
          type: "main"
        }
      );
    }
    if (this.MenuItems.indexOf('Outbox') >= 0) {
      this.children.push(
        {
          displayName: "Outbox",
          icon: "/assets/images/Outbox.svg",
          icon_active: "/assets/images/Outbox_active.svg",
          route: '/page/outbox',
          type: "main"
        }
      );
    }
    // if (this.MenuItems.indexOf("Settings") >= 0) {
    //   this.children.push({
    //       id: "settings",
    //       title: " Settings",
    //       // translate: "NAV.ADMIN.LOG",
    //       type: "item",
    //       icon: "settingIcon",
    //       isSvgIcon: true,
    //       // icon: 'receipt',
    //       url: "/pages/setting",
    //   });
    // }

    // if (this.MenuItems.indexOf('Reports') >= 0) {
    //   this.children.push(
    //     {
    //       displayName: "Models",
    //       icon: "assets/icons/model.svg",
    //       icon_active: "assets/icons/models_active.svg",
    //       route: '/page/models/dashboard',
    //       type: "main"
    //     }
    //   );
    // }
    
    if (this.MenuItems.indexOf('AdminPanel') >= 0) {
      this.children.push(
        {
          displayName:"Admin panel",
          icon:"assets/icons/admin.svg",
          icon_active:"assets/icons/admin_active.svg",
          route:'page/user-management',
          type: "others",
          children:[
            {displayName:'App',route:'page/user-management/menu-app'},
            {displayName:'Role',route:'page/user-management/role'},
            {displayName:'User',route:'page/user-management/user'}
          ]
        }
      );
    }
    // if (this.MenuItems.indexOf("LoginHistory") >= 0) {
    //   this.children.push({
    //     displayName: "others",
    //     icon: "assets/icons/model.svg",
    //     icon_active: "assets/icons/models_active.svg",
    //     route: '/page/models/dashboard',
    //     type: "others"
    //   });
    // }
    // if (this.MenuItems.indexOf("Log") >= 0) {
    //   this.children.push({
    //     displayName: "others",
    //     icon: "assets/icons/model.svg",
    //     icon_active: "assets/icons/models_active.svg",
    //     route: '/page/models/dashboard',
    //     type: "others"
    //   });
    // }


  
    // Saving local Storage
    localStorage.setItem('menuItemsData', JSON.stringify(this.children));
    // Update the service in order to update menu
    this._menuUpdationService.PushNewMenus(this.children);
  }
  hider() {
    this.hide = false;
  }
  hider2() {
    this.hide = true;
  }
}
