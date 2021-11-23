import {Injectable, Pipe, PipeTransform, NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import '@angular/compiler';

import { PageRoutingModule } from './page-routing.module';
import { RepositoryComponent } from './repository/repository.component';
import { CreatedialogComponent } from './repository/createdialog/createdialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {  MatTreeModule } from '@angular/material/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OutboxComponent } from './outbox/outbox.component';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';
import { DocumentCenterComponent } from './document-center/document-center.component';
import { ConfirmationDialogComponent } from './document-center/confirmation-dialog/confirmation-dialog.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import { NewDoucumentComponent } from './new-doucument/new-doucument.component';
import { NgxUploaderModule } from 'ngx-uploader';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AttachmentviewComponent } from './new-doucument/attachmentview/attachmentview.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SignaturePadModule } from 'angular2-signaturepad';
import { DigitalSigningComponent } from './digital-signing/digital-signing.component';
import { SignaturePadorImgComponent } from './digital-signing/signature-pador-img/signature-pador-img.component';
import { OwnerRemarksComponent } from './digital-signing/owner-remarks/owner-remarks.component';
import { SigndocumentComponent } from './digital-signing/signdocument/signdocument.component';
import { AadhardocumentsComponent } from './digital-signing/aadhardocuments/aadhardocuments.component';
import { CursorSignPageComponent } from './digital-signing/cursor-sign-page/cursor-sign-page.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    RepositoryComponent,
    CreatedialogComponent,
    OutboxComponent,
    DocumentCenterComponent,ConfirmationDialogComponent,NewDoucumentComponent,
    AttachmentviewComponent,
    DigitalSigningComponent,SignaturePadorImgComponent,OwnerRemarksComponent,
    SigndocumentComponent,
    AadhardocumentsComponent,CursorSignPageComponent
  ],
  imports: [
    CommonModule,
    PdfViewerModule,
    PageRoutingModule,
    MatButtonModule,
    NgxUploaderModule ,
    NgxFileDropModule ,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    SignaturePadModule,
    MatCheckboxModule,
    MatProgressBarModule,
    FormsModule,
    MatDatepickerModule,
    MatTableModule,
    MatPaginatorModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatMenuModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    FormsModule,
    NgApexchartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatDialogModule
    

  ],
  providers: [
    DecimalPipe,
    DatePipe
],
  entryComponents: [CreatedialogComponent,ConfirmationDialogComponent,AttachmentviewComponent,
    OwnerRemarksComponent,SignaturePadorImgComponent,SigndocumentComponent
  ]
})
export class PageModule { }
