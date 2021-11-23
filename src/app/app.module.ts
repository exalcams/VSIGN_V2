import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule  }   from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import {
//   MatButtonModule, MatIconModule, MatSnackBar,MatAutocomplete, MatSnackBarModule, MatDialogModule,
//   MatDatepickerModule,MatNativeDateModule,MAT_DATE_LOCALE, MatProgressSpinnerModule, MatProgressBarModule, MatExpansionModule, MatFormFieldModule, MatAutocompleteModule, MatBadgeModule, MatBottomSheetModule, MatButtonToggleModule, MatCardModule, MatCheckboxModule, MatChipsModule, MatDividerModule, MatGridListModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSidenavModule, MatSliderModule,
//    MatSlideToggleModule} from '@angular/material';
import { LoginslideComponent } from './loginslide/loginslide.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatChipsModule} from '@angular/material/chips'
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatBadgeModule} from '@angular/material/badge'
import {MatBottomSheetModule} from '@angular/material/bottom-sheet'
import {MatCardModule} from '@angular/material/card'
import {MatButtonToggleModule} from '@angular/material/button-toggle'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MatDividerModule} from '@angular/material/divider'
import {MatGridListModule} from '@angular/material/grid-list'
import {MatInputModule} from '@angular/material/input'
import {MatListModule} from '@angular/material/list'
import {MatMenuModule} from '@angular/material/menu'
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatSelectModule} from '@angular/material/select'
//import {MatNativeDateModule} from '@angular/material/'
import {MatSliderModule} from '@angular/material/slider'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatRadioModule} from '@angular/material/radio'
// import {MatRippleModule} from '@angular/material/ripple'
import {MatSidenavModule} from '@angular/material/sidenav'
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoaderComponent } from './loader/loader.component';
import { AuthService } from './service/auth.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuItemComponent } from './menu-item/menu-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginslideComponent,
    LoaderComponent,
    DashboardComponent,
    MenuItemComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    MatCarouselModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,

        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatDialogModule,
        
        MatExpansionModule,
        MatAutocompleteModule,
    
        MatFormFieldModule,
        MatAutocompleteModule,
        
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
       // MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        // MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        NgxSpinnerModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
