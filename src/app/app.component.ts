import { trigger, transition, style, animate, state } from '@angular/animations';
import { AfterViewInit, Compiler, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationDetails } from './models/master';
import { NavItem } from './models/navigation';
import { AuthService } from './service/auth.service';
import { MenuUpdataionService } from './service/menu-update.service';
import { NavService } from './service/nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeSlideInOut_one', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),

    ]),

    trigger('fadeSlideInOut', [

      state('none, void', style({
        opacity: 0, transform: 'translateY(10px)'
      })),
      state('maximum', style({
        opacity: 1, transform: 'translateY(0)'
      })),
      transition('none => maximum', animate('0.8s'))
    ]),

  ],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements AfterViewInit, OnInit{
  isFolded: boolean = false;
  isLoggedin: boolean = false;
  navItems1: NavItem[] = [];
  navItems2: NavItem[] = [];
  currentUser: AuthenticationDetails;

  @ViewChild("araDrawer") appDrawer: ElementRef;
  authenticationDetails: AuthenticationDetails;
  CurrentLoggedInUser: string;

  constructor(
    private _navService: NavService,
    private _menuUpdationService: MenuUpdataionService,
    private authservice: AuthService,
    private router: Router,
    private _compiler: Compiler
  ) {
    this.authservice.currentUser.subscribe(x => this.currentUser = x);
    this.authservice.changeEmitted$.subscribe(
      value => {
        this.isLoggedin = value;
      });
  }

  ngAfterViewInit() {
    this._navService.appDrawer = this.appDrawer;
    
  }

  ngOnInit() {
    const retrievedObject = localStorage.getItem('authorizationData');
        if (retrievedObject) {
            this.authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
            this.CurrentLoggedInUser = this.authenticationDetails.DisplayName;
            console.log(this.CurrentLoggedInUser,"Login")
            //this.CurrentLoggedInUserEmailAddress = this.authenticationDetails.EmailAddress;
            // if (this.authenticationDetails.profile && this.authenticationDetails.profile !== 'Empty') {
            //     this.CurrentLoggedInUserProfile = this.authenticationDetails.profile;
            // }
        }
    const menuItems = localStorage.getItem('menuItemsData');
    if (menuItems) {
      this.navItems1=[];this.navItems2=[];
      var navItems = JSON.parse(menuItems);
      navItems.forEach((item: NavItem) => {
        if (item.type == "main") {
          this.navItems1.push(item);
        }
        else if (item.type == "others") {
          this.navItems2.push(item);
        }
      });
    }
    // Update the menu items on First time after log in
    this._menuUpdationService.GetAndUpdateMenus().subscribe(
      data => {
        this.navItems1=[];this.navItems2=[];
        var navItems = data;
        navItems.forEach((item: any) => {
          if (item.type == "main") {
            this.navItems1.push(item);
          }
          else if (item.type == "others") {
            this.navItems2.push(item);
          }
        });
      }
    );
  }

  toggleSideMenu() {
    this.isFolded = !this.isFolded;
  }

  logout() {
    this.authservice.SignOut(this.currentUser.UserID).subscribe(
      (data) => {
        localStorage.removeItem('authorizationData');
        //this.CurrentLoggedInUser="";
        localStorage.removeItem('menuItemsData');
        localStorage.removeItem('userPreferenceData');
        localStorage.clear();
        this._compiler.clearCache();
        this.router.navigate(['login']);
      },
      (err) => {
        console.error(err);
        this.router.navigate(['login']);
      }
    );
  }
}
