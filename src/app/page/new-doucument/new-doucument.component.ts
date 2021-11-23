
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from '../new-doucument/document.service';
 import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
// import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';

// import { SnackBarStatus } from "app/notifications/notification-snack-bar/notification-snackbar-status-enum";

import { from, Observable, of } from 'rxjs';
// import { PopupcreateComponent } from './popupcreate/popupcreate.component';
import { createdoc } from './models/createdoc.model';
import { docapp } from './models/docapp.model';
// import { NotificationSnackBarComponent } from 'app/notifications/notification-snack-bar/notification-snack-bar.component';
import { concatMap, map, startWith } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AllUser } from './models/AllUser.model';
// import { AuthenticationDetails, UserWithRole } from 'app/models/master';
import { returnDocid } from './models/returnDocid.model';
import { DocReturnData } from './models/returndataPostgres.model';
import { ReleaseDocParams } from './models/releaseparam.model';
import { Reference } from '@angular/compiler/src/render3/r3_ast';
import { ReferenceDoc } from './models/Reference.model';
import { DocTag } from './models/Tag.model';
import { DocAppLog } from './models/AppLog.model';
import { TagsAndIDs } from './models/TagsAndIDs.model';
import { DatePipe } from '@angular/common';
import { TempUserReturnData } from './models/TempUserData.model';
import { GetattachmentdetailsService } from './getattachmentdetails.service';
import { TypeCheckCompiler } from '@angular/compiler/src/view_compiler/type_check_compiler';
import { DocDistMail } from './models/DistMail.model';
import { SignProcessOutput } from './models/SignProcessOutput.model';
import { docatt } from './models/docatt.model';
// import { GeardialogComponent } from './geardialog/geardialog.component';
// import { ActionLog } from 'app/models/OrderFulFilment';
//import { AuthService } from 'app/services/auth.service';
import { AttachmentviewComponent } from './attachmentview/attachmentview.component';
// import { SignPageComponent } from './sign-page/sign-page.component';
import { AuthService } from 'src/app/service/auth.service';
// import { MailService } from 'src/app/service/mail.service';
import { ActionLog, AuthenticationDetails, UserWithRole } from 'src/app/models/master';
import { NotificationSnackBarComponent } from 'src/app/notifications/notification-snack-bar/notification-snack-bar.component';
import { SnackBarStatus } from 'src/app/notifications/snackbar-status-enum';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';
import { NgxSpinnerService } from 'ngx-spinner';
// import { MailService } from 'app/services/mail.service';
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface Type {
  value: string |any;
  viewValue: string;
}
interface Ref {
  value: string |any;
  viewValue: string;
}
@Component({
  selector: 'app-new-doucument',
  templateUrl: './new-doucument.component.html',
  styleUrls: ['./new-doucument.component.scss'],
  
})
export class NewDoucumentComponent implements OnInit {
  public now: Date = new Date();
  pagesFromgroup:FormGroup;
  displayname: string = "";
  panelOpenState: boolean = false;
  ActionLog: any;
  curruser:AuthenticationDetails ;
  readioSelected:string = "Existing";
  color="238, 238, 251, 0.05";
  radi=50;
  showExtraClass = true;
  public files: NgxFileDropEntry[] = [];
  pages: any;
  pagess: boolean;
  pagess1: boolean;
  custom: string;
 
  public dropped(files: NgxFileDropEntry[]) {
    
    this.files = files;
    for (const droppedFile of files) {
 
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
 
          console.log(droppedFile.relativePath, file);
 
 
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
 
  public fileOver(event:any){
    console.log(event);
  }
 
  public fileLeave(event:any){
    console.log(event);
  }



  signs: Type[] = [
    { value: '1', viewValue: 'VSure' },
    { value: '2', viewValue: 'Self Sign' },
    { value: '3', viewValue: 'Certificate' },
    { value: '4', viewValue: 'USB Token' },
    { value: '5', viewValue: 'Aadhaar' }
  ];
  Referances: Ref[] = [
    { value: '1', viewValue: 'Purchase Order' },
    { value: '2', viewValue: 'Contract' },
    { value: '3', viewValue: 'Agreement' },
    { value: '4', viewValue: 'NDA' },
    { value: '5', viewValue: 'Employee' },
    { value: '6', viewValue: 'Vendor' },
    { value: '7', viewValue: 'Customer' }
  ];
  selectedData:SignProcessOutput;
  selectedoptionfromdialog: string = "";
  totalPages: any;
  isProgressBarVisibile = false;
  DocID:string;
  myControl = new FormControl();
  options1: string[] = ['One', 'Two', 'Three'];

  filteredOptions: Observable<string[]>;

  ArrTempUsers =[];
  myform: FormGroup

  Title = new FormControl('', Validators.required);
  Tag = new FormControl('', Validators.required);
  toppings = new FormControl('', Validators.required);
  refno = new FormControl('', );
  dueDate = new FormControl('', Validators.required);
  remark = new FormControl('', Validators.required);
  Refctrl = new FormControl('', Validators.required);
  file = new FormControl('', Validators.required);
  releasedocFlag = false;
  MAC_address = ""
  IP_address = "";
  toppingList: string[] = ['VSure', 'Self',  'Token', 'Company Certificate','Tag'];
  // toppingList: string[] = ['VSure', 'Token', 'Company Certificate'];
  popup: any;
  userflag: boolean = false;
  emailflag: boolean = false;
  file1: any;
  TagKeys: TagsAndIDs[] 
  filteredTagKeys: Observable<any[]>;
  signvsure: string = "";
  signself: string = "";
  signaadhar: string = "";
  singtoken: string = "";
  viewClient: string = "";
  viewCompany: string = "";
  viewDocId: string = "";
  signcertificate: string = "";
  signcursor: string = "";
  signtag: string = "";
  // displayname: string = "";
  hideRelease = true;
  hideRelease1 = true;
  filenames = [];
  flagadduser: boolean = false;
  flagaddhide: boolean = true;
  flagadduser1: boolean = false;
  flagaddhide1: boolean = true;
  date: Date = new Date();
  newdocid = "";
  newattid = "";
  select: any;
  selecteduserFromdropDown
  // curruser: AuthenticationDetails;
  allRefs: ReferenceDoc[]
  allUser: AllUser[];
 
  filteredUsers: AllUser[];

  hideAddEmail = false;
  hideAddUser = false;
  dtag: DocTag = new DocTag();
  changeinTitle = 0;
  changeinTage = 0;
  changeinSign = 0;
  changeinDate = 0;
  changeinUserList = 0;
  changeinFiles = 0;
  usernameindex1: any;
  filtereduseroptions: Observable<any>;
  removeItem(i: number): void {
    
    this.arr1.splice(i, 1);
    if(this.ArrTempUsers.indexOf(this.arr1[i])>=0){
      this.ArrTempUsers.slice(i,1);
    }
    this.hideRelease = false;

  }
  remove(item) {
    console.log("removed", item);
    this.files1.splice(this.files1.indexOf(item), 1);
    this.filenames.splice(this.files1.indexOf(item.name));
    this.changeinFiles++;
  }
  // files: File[] = [];

  onSelect(event) {
    console.log(event);
    this.files.push(event.addedFiles);
  }
  private _filter(value: string): AllUser[] {
    const filterValue = value.toLowerCase();

    let indx = this.filteredUsers.find(x => x.UserName == this.form.get('user').value);
    console.log(indx, indx == null ? "" : indx.UserName);

    return this.filteredUsers.filter(option => option.DisplayName.toLowerCase().includes(filterValue));
  }
  onRemove(event) {
    console.log(event);
    this.files1.splice(this.files1.indexOf(event), 1);
  }

// onCreate2() {

//   const dialogconfig = new MatDialogConfig();
//   dialogconfig.disableClose = false;
//   dialogconfig.autoFocus = true;
//   // dialogconfig.data = {
//   //   sgnSelf: this.docattandRmrks.signSelf,
//   //   sgnImg:this.docattandRmrks.signImg,
//   //   sgnCert:this.docattandRmrks.signCert,
//   //   sgnToken:this.docattandRmrks.signToken,
//   //   sgnAadhar:this.docattandRmrks.signAadhar,
//   //   nofselected:this.FileNames.length==this.selectedFilename.length?"All":this.selectedFilename.length

//   // }
//   dialogconfig.data ={
//     levelusers : this.arr1
//   }

//   const data = this.Dialog.open(SignPageComponent, dialogconfig);
//   data.afterClosed().subscribe(data => {
//     // console.log(data);
//     this.selectedData  = data as SignProcessOutput
//     console.log(this.selectedData);
    
//     if (this.selectedData !=null) {
//     //   if (this.selectedData.sgnPages === "all") {
//     //     this.selectedoptionfromdialog = "All"
//     //   }
//     //   else if (this.selectedData.sgnPages === "last") {
//     //     this.selectedoptionfromdialog = this.totalPages + "_";
//     //   }
//     //   else if (this.selectedData.sgnPages === "1_") {
//     //     this.selectedoptionfromdialog = "1_"
//     //   }
//     //   else {
//     //     this.selectedoptionfromdialog = this.selectedData.sgnPages;
//     //   }

//     //  if(this.selectedData.sgnLocation==="Tag"){
//     //    this.selectedoptionfromdialog = "All";
//     //  }
//     //   console.log(this.selectedoptionfromdialog);
  
//     }
//   })
// //end
// }

  drop(event: CdkDragDrop<string[]>) {
    this.hideRelease = false;

    moveItemInArray(this.arr1, event.previousIndex, event.currentIndex);
  }
  file1s: File[] = [];
  name: string[] = [];
  name1: any;
  i: any;

  
  arr1 = [];

  flag: boolean = false;
  size: any;
  options: UploaderOptions;
  formData: FormData;
  files1: File[] = [];
  listdocapp: docapp[] = []
  newTempUsers:UserWithRole[] = [];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  formdata: FormData = new FormData();
  selected = 'option2';
  selected1 = 'option2';
  selected2 = 'option2';
  user: string;
  usernameindex: string;
  role: string;
  minDate = new Date();
  email: string;
  snackbar: NotificationSnackBarComponent
  forUpdating: string = "No";
  color1 = 'primary';
  mode = 'indeterminate';
  hidespin = false;
  viewDocH: createdoc
  form: FormGroup;
  docFulfilment:string;
  Atts: string[] = [];
  //oncreate
  onCreate1() {

    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = false;
    dialogconfig.autoFocus = true;
    dialogconfig.data ={
      levelusers : this.arr1
    }
   }


  constructor(private spinner: NgxSpinnerService,private router: Router, private service: DocumentService, private snackBar: MatSnackBar,
    private Dialog: MatDialog, private fb: FormBuilder,private dateAdapter: DateAdapter<Date>,
    private datepipe:DatePipe,private attachmentdetails: GetattachmentdetailsService,private _authservice:AuthService){
    this.curruser = JSON.parse(localStorage.getItem("authorizationData")); 
    this.displayname = this.curruser.DisplayName;
      console.log('newname',this.displayname);

      this.files1 = []; // local uploading files array
      // this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
      // this.humanizeBytes = humanizeBytes;
      this.dateAdapter.setLocale('en-US'); 
      this.curruser = JSON.parse(localStorage.getItem("authorizationData"));
      this.docFulfilment = localStorage.getItem("fulfilmentSave");
      console.log(this.docFulfilment);
      this.snackbar = new NotificationSnackBarComponent(this.snackBar)
      this.form = this.fb.group({
        user: ['', Validators.required],
        user1: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        select: ['user', Validators.required]
      });
  
      this.displayname = this.curruser.DisplayName;
      this.change('user')
      
      this.service.getUsers().subscribe((x: AllUser[]) => {
        this.allUser = x;
        console.log(this.allUser);
        this.filteredUsers = this.allUser.filter(g=>g.RoleName.toLowerCase()=="user");
        console.log(this.filteredUsers);
        
        
        this.filtereduseroptions = this.form.get('user').valueChanges.pipe(
          startWith(''),
  
          map(value => this._filter(value as string))
        );
        console.log(this.form.get('user').value);
      })
      
      // this.service.getTags().subscribe((x:TagsAndIDs[])=>{​​​​​​​
      //   this.TagKeys = x;
      //   console.log(this.TagKeys);
      //   this.filteredTagKeys = this.Tag.valueChanges.pipe(
      //     startWith(''),
      //     map(value => this._filter(value))
      //   );
  
      // }​​​​​​​)
      this.service.getAllRefs().subscribe((x: ReferenceDoc[]) => {
        this.allRefs = x;
        console.log(x);
  
      })
      this.service.getTags().subscribe((x:TagsAndIDs[])=>{
        this.TagKeys = x;
        console.log(this.TagKeys);
        this.TagKeys  = this.TagKeys.filter(j=>j.tagName!="")
        this.filteredTagKeys = this.Tag.valueChanges.pipe(
          startWith(''),
          map(value => this._filterTags(value as string))
        );
        
      })
      this.service.getIPAddress().subscribe((j: any) => {
        console.log(j);
  
        this.IP_address = j.ip;
      })
  
    }
    
    
    private _filterTags(value: string): TagsAndIDs[] {
      const filterValue = value.toLowerCase();
   
    let indx = this.TagKeys.find(x=>x.tagName==this.Tag.value);
    console.log(indx,indx==null?"" :indx.tagID);
    
      return this.TagKeys.filter(option => option.tagName.toLowerCase().includes(filterValue));
    }
  deleteRow(index:number){
    this.files.splice(index, 1);
}
ngOnInit(){
  this._authservice.isLoggedin(true);
  // this.spinner.show();
this.pagesFromgroup=this.fb.group({
  Pagesfield:['']
})
  if (localStorage.getItem("viewDocId") != null && localStorage.getItem("viewClient") != null && localStorage.getItem("viewCompany") != null) {
    this.spinner.show();
    this.viewClient = localStorage.getItem("viewClient");
    this.viewCompany = localStorage.getItem("viewCompany");
    this.viewDocId = localStorage.getItem("viewDocId");
    

    this.pages=localStorage.getItem("Pages");
    console.log(localStorage.getItem("Pages"));
    if(this.pages=="all"){
      this.pagess=true;
      this.pagess1=false;
    }
    else if(this.pages=="1_"){
      this.pagess=false;
      this.pagess1=true;
    }
    else{
      this.custom=localStorage.getItem("custompages");
      this.pagess=false;
      this.pagess1=false;
    }
    

    if (localStorage.getItem("forUpdating") != null) {
      this.forUpdating = localStorage.getItem("forUpdating");
    }
    else {
      this.forUpdating = "No";
    }
    this.service.getDocAtts(this.viewDocId, this.viewClient, this.viewCompany).subscribe((x: string[]) => {
      
      this.Atts = x;
      this.service.getfilefromPostGres(x).subscribe((y: DocReturnData[]) => {
        this.spinner.show();
        y.forEach(q => {
          const blob = this.dataURItoBlob(q.files)
          const file = new File([blob], q.fileName, { 'type': q.fileType })
          console.log(file);
          this.files1.push(file);
          for (this.i = 0; this.i < this.files1.length; this.i++) {
            this.name1 = this.files1[this.i].name;
            this.size = this.files1[this.i].size;
            this.flag = true;
            console.log(this.name1);

            this.size = (this.files1[this.i].size) / 1024 * 1000 + "kb"
            console.log("size", this.size);
          }
        })
        this.service.getDocHdata(this.viewDocId, this.viewClient, this.viewCompany).subscribe((k: createdoc) => {
          let doch = k;
          console.log(doch);
          this.viewDocH = doch;
          this.Title.patchValue(doch.title);
          this.refno.patchValue(doch.refNumber);
          this.remark.patchValue(doch.remarks);
          this.Refctrl.patchValue(doch.refID!=""?this.allRefs.find(c => { return c.refID == doch.refID }).refType:"");
          this.dueDate.patchValue(doch.finalDueDate);
          let selectedsign: string[] = [];
          if (doch.signAadhaar === "Yes") {
            selectedsign.push("Aadhar");
          }
          if (doch.signCaPfx === "Yes") {
            selectedsign.push("Company Certificate")
          }
          if (doch.signCaToken === "Yes") {
            selectedsign.push("Token")
          }
          if (doch.signImage === "Yes") {
            selectedsign.push("Self")
          }
          if (doch.signSelf === "Yes") {
            selectedsign.push("VSure")
          } if (doch.signCursor === "Yes") {
            selectedsign.push("Cursor")
          } if (doch.signTag === "Yes") {
            selectedsign.push("Tag")
          } 

          this.toppings.patchValue(selectedsign);
          this.service.getLevelUsers(this.viewDocId, this.viewClient, this.viewCompany).subscribe((z: docapp[]) => {
            this.listdocapp = z;
            console.log(this.listdocapp);
            this.service.getTag(this.viewClient, this.viewCompany, this.viewDocId).subscribe((g: DocTag) => {
              console.log(g);
              this.dtag = g;
              this.Tag.patchValue(g!=null?this.dtag.tagName:"");
            })
            this.listdocapp.forEach(g => {
              this.allUser.forEach(h => {
                
                

                if (h.ClientID === g.client) {

                  this.arr1.push(h)
                  if(h.RoleName.toLowerCase()=="tempuser"){
                    this.ArrTempUsers.push(h);
                  }

                }
              })

            })
            // this.spinner.hide();
          })
        })
        this.spinner.hide();
      })
  
    })
    // this.spinner.hide();

  }
  // this.spinner.hide();
}

// GearDialog(){
//   let dialogdata =new MatDialogConfig();
//   dialogdata.data = 
//     this.arr1
    

  
//   console.log(this.arr1);
//   this.CreateActionLogvalues("User Tag Dialog");
//   const data = this.Dialog.open(GeardialogComponent, {data:{dialogdata},
//     height: '40%',
//     width: '60%'
// });
//   data.afterClosed().subscribe(data => {
//     this.CreateActionLogvalues("UserTag Dialog Close");
// console.log(data);

//   })
// }
Router(){
  this.router.navigate(["/page/dashboard"]);
}
dataURItoBlob(dataURI) {
  const byteString = window.atob(dataURI);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([int8Array]);
  return blob;
}
reasonChange() {
  console.log(this.toppings.value);
  let tempreasons: string[] = this.toppings.value;
  // (this.toppings.value).forEach(element => {
  //   this.toppingList.indexOf(element)
  // });
  if (tempreasons.indexOf("VSure") >= 0) {
    this.signvsure = "Yes";

  }
  if (tempreasons.indexOf("Self") >= 0) {

    this.signself = "Yes";

  }
  if (tempreasons.indexOf("Aadhar") >= 0) {

    this.signaadhar = "Yes";

  }
  if (tempreasons.indexOf("Token") >= 0) {

    this.singtoken = "Yes";

  }
  if (tempreasons.indexOf("Company Certificate") >= 0) {

    this.signcertificate = "Yes";
  }
  if (tempreasons.indexOf("Cursor") >= 0) {

    this.signcursor = "Yes";
  }
  if (tempreasons.indexOf("Tag") >= 0) {

    this.signtag = "Yes";
  }




}
ontick() {
  this.CreateActionLogvalues("Adding User");
  console.log(this.form.value);
  const usercontrol = this.form.get('user');
  const emailcontrol = this.form.get('email');
  // this.username = this.form.get('user').value;
  // this.role = this.form.get('email').value;
  // this.flagadduser = false;
  // this.arr2.push(this.form.value);
  // for (let i = 0; i < this.arr2.length; i++) {

  this.usernameindex = this.form.get('user').value;
  this.usernameindex1 = this.form.get('user1').value;
  this.email = this.form.get('email').value;
  this.select = this.form.get('select').value;
  if (this.select == "user/Email") {


    let tp: AllUser = new AllUser();
    tp.UserName = this.form.get("user1").value;
    tp.Email = this.form.get("email").value;
    tp.RoleName = 'TempUser';
    this.arr1.push(tp);
    this.ArrTempUsers.push(tp);
    this.panelOpenState = false;
  } else {

    if ((this.usernameindex !== "" || this.email !== "") && (this.usernameindex !== null || this.email != null)) {

      if (this.arr1.indexOf(this.filteredUsers.find(k=>k.UserName==this.usernameindex)) < 0) {
        this.arr1.push(this.filteredUsers[this.filteredUsers.findIndex(k=>k.UserName==this.usernameindex)]);
        this.panelOpenState=false;
      }
      else {
        this.snackbar.openSnackBar("Duplicates not allowed", SnackBarStatus.danger, 2000);
        this.panelOpenState = !this.panelOpenState;
      }
    }
   

  }




  console.log("arr", this.arr1);
  this.form.reset();
  this.flagaddhide = true;
  this.flagaddhide1=false;
  usercontrol.clearValidators();
  usercontrol.enable();
  emailcontrol.enable();
  emailcontrol.clearValidators();
}
ontick1() {
  this.CreateActionLogvalues("Adding User");
  console.log(this.form.value);
  const usercontrol = this.form.get('user');
  const emailcontrol = this.form.get('email');
  // this.username = this.form.get('user').value;
  // this.role = this.form.get('email').value;
  // this.flagadduser = false;
  // this.arr2.push(this.form.value);
  // for (let i = 0; i < this.arr2.length; i++) {

  this.usernameindex = this.form.get('user').value;
  this.usernameindex1 = this.form.get('user1').value;
  this.email = this.form.get('email').value;
  this.select = this.form.get('select').value;
  if (this.select == "user/Email") {


    let tp: AllUser = new AllUser();
    tp.UserName = this.form.get("user1").value;
    tp.Email = this.form.get("email").value;
    tp.RoleName = 'TempUser';
    this.arr1.push(tp);
    this.ArrTempUsers.push(tp);
    this.panelOpenState = false;
  } else {

    if ((this.usernameindex !== "" || this.email !== "") && (this.usernameindex !== null || this.email != null)) {

      if (this.arr1.indexOf(this.filteredUsers.find(k=>k.UserName==this.usernameindex)) < 0) {
        this.arr1.push(this.filteredUsers[this.filteredUsers.findIndex(k=>k.UserName==this.usernameindex)]);
        this.panelOpenState=false;
      }
      else {
        this.snackbar.openSnackBar("Duplicates not allowed", SnackBarStatus.danger, 2000);
        this.panelOpenState = !this.panelOpenState;
      }
    }
   

  }




  console.log("arr", this.arr1);
  this.form.reset();
  this.flagaddhide = false;
  this.flagaddhide1=true;
  usercontrol.clearValidators();
  usercontrol.enable();
  emailcontrol.enable();
  emailcontrol.clearValidators();
}
change(value: string) {

  const usercontrol = this.form.get('user');
  const emailcontrol = this.form.get('email');


  // emailcontrol.enable();
  if (value === 'user') {
    this.userflag = true;
    this.emailflag = false;
    emailcontrol.reset();
    usercontrol.setValidators([Validators.required]);
    emailcontrol.clearValidators();
    this.hideAddEmail = false;
    this.hideAddUser = true;
  }
  else if (value === 'user/Email') {
    this.emailflag = true;
    this.userflag = false;
    usercontrol.reset();
    emailcontrol.setValidators([Validators.required]);
    usercontrol.clearValidators();
    this.hideAddEmail = true;
    this.hideAddUser = false;
  }


  usercontrol.updateValueAndValidity();
  emailcontrol.updateValueAndValidity();



}
onUploadOutput(output: UploadOutput): void {
  console.log(output);

  switch (output.type) {
    case 'allAddedToQueue':
   
      break;
    case 'addedToQueue':
      if (typeof output.file !== 'undefined') {
        if (this.filenames.indexOf(output.file.nativeFile.name) < 0) {
          this.files1.push(output.file.nativeFile);
          this.filenames.push(output.file.nativeFile.name);
        }
        else {
          this.snackbar.openSnackBar("Duplicates Files not allowed", SnackBarStatus.danger, 2000);
        }

        console.log(this.files1);
        this.changeinFiles++;
        for (this.i = 0; this.i < this.files1.length; this.i++) {
          this.name1 = this.files1[this.i].name;
          this.size = this.files1[this.i].size;
          this.flag = true;
          console.log(this.name1);

          this.size = (this.files1[this.i].size) / 1024 * 1000 + "kb"
          console.log("size", this.size);
        }
        // alert("your file size "+ (this.files1[0].size)/1024 *1000 + "kb")
      }
      break;
    // case 'uploading':
    //   if (typeof output.file !== 'undefined') {
    //     // update current data in files array for uploading file
    //     const index = this.files1.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
    //     this.files1[index] = output.file;
    //   }
    //   break;
    // case 'removed':
    //   // remove file from array when removed
    //   this.files1 = this.files1.filter((file: UploadFile) => file !== output.file);
    //   break;
    case 'dragOver':
      this.dragOver = true;
      break;
    case 'dragOut':
    case 'drop':
      this.dragOver = false;
      break;
    case 'done':
      // The file is downloaded
      break;
  }
}
onCreate() {
  // this.panelOpenState=true;
  this.flagadduser = true;
  this.flagaddhide = !this.flagaddhide;
  this.flagadduser1 = false;
  this.flagaddhide1 =false;
  this.form.patchValue({ select: 'user' });
  this.change('user')

}
onCreatee() {
  // this.panelOpenState=true;
  this.flagadduser1 = true;
  this.flagaddhide1 = !this.flagaddhide1;
  
  this.flagadduser=false;
  // this.flagaddhide=false;
  this.form.patchValue({ select: 'user/Email' });
  this.change('user/Email')

}
UpdatePostgres() {
  this.service.deleteAttPostGres(this.Atts).subscribe(() => {
    this.formdata = new FormData();
    this.files1.forEach(f => {
      this.formdata.append(f.name, f, f.name);
    })
    this.service.deleteAtts(this.Atts).subscribe(() => {
      this.service.postfiletoPostGres(this.formdata).subscribe((l: any) => {
        const attids: string[] = l;
        console.log(l);


        console.log("l", l);
        let att: Array<docatt> = new Array<docatt>();
        attids.forEach(a => {
          let t: docatt = new docatt();
          t.Company = this.curruser.Company;
          t.Client = this.curruser.ClientID;
          t.DocId = this.viewDocId;
          t.Type = 'pdf';
          t.AttId = a;
          t.AttId1 = "";
          t.User = this.curruser.UserName;
          t.Signed = "";

          att.push(t);
          console.log("completed doc upload to postgres");
        })
        let i = 1;
        this.arr1.forEach((a: AllUser) => {
          attids.forEach(b => {
            if (a.ClientID != this.curruser.ClientID) {
              let t: docatt = new docatt();
              t.Company = a.Company;
              t.Client = a.ClientID;
              t.Type = "pdf";
              t.AttId = b;
              t.AttId1 = "";
              t.DocId = this.viewDocId;
              t.User = a.UserName;
              t.Signed = ""
              att.push(t);
            }
          })
        })
        this.service.updateDocAtt(att).subscribe((m: any) => {


          if (this.releasedocFlag) {
            let releaseADoc: ReleaseDocParams = new ReleaseDocParams();
            releaseADoc.Client = this.curruser.ClientID;
            releaseADoc.Company = this.curruser.Company;
            releaseADoc.DocID = this.viewDocId;
            releaseADoc.Status = "Released";
            this.service.releaseDoc(releaseADoc).subscribe(() => {
              this.snackbar.openSnackBar("Document created successfully", SnackBarStatus.success, 2000);
              this.hidespin = false
              this.router.navigate(["/page/dashboard"]);
            })
          }
          else {
            this.snackbar.openSnackBar("Document created successfully", SnackBarStatus.success, 2000);
            this.hidespin = false
            this.router.navigate(["/page/dashboard"]);
          }

        })
      })
    })
  })
} 
release() {
//  localStorage.removeItem("Pages");
//  localStorage.removeItem("custompages");
  this.CreateActionLogvalues("Releasing Document");
  this.releasedocFlag = true;
  this.spinner.show();
  this.startUpload();
}
startUpload(): void {
  this.spinner.show();
  this.hidespin =true;
  setInterval(() => {
    this.now = new Date();
  }, 1);
  console.log(this.now);
  var timeonly=this.datepipe.transform(this.now,"HH.mm");
  console.log(timeonly);
  localStorage.setItem("latesttime",timeonly);
  if(this.pagesFromgroup.get('Pagesfield').value!=null){
  var custompage=this.pagesFromgroup.get('Pagesfield').value;
  localStorage.setItem("custompages",custompage);
  if(custompage!=""){
    var underscore="_";
    var mergepageformat =underscore+custompage;
    console.log(mergepageformat);
    localStorage.setItem("Pages",mergepageformat);
  }

  // var custompage=this.pagesFromgroup.get('Pagesfield').value;
  // if(custompage!=""){
  //   var underscore="_";
  //   var mergepageformat =underscore+custompage;
  //   console.log(mergepageformat);
  //   localStorage.setItem("Pages",mergepageformat);
  // }
}
  this.CreateActionLogvalues("Saving Document");
  this.file1 = "File upload is required";
  console.log(this.Title.valid, this.Tag.valid, this.refno.valid, this.Refctrl.valid, this.dueDate.valid, this.remark.valid, this.file.valid);

  if (this.Title.valid && this.dueDate.valid && this.arr1.length > 0 && this.files1.length>0) {
    this.spinner.show();
    if (this.forUpdating === "Yes") {
      let arrUsers: string[] = [];
      arrUsers.push(this.viewDocId);
      this.listdocapp.forEach(k => {
        arrUsers.push(k.client)
      })
      this.service.deleteUsers(arrUsers).subscribe(() => {
        let ToCreateTempUsrs:UserWithRole[] =[];

          this.ArrTempUsers.forEach(b=>{
            let tusr = new UserWithRole();
            
            tusr.Company = this.curruser.Company;
            tusr.CreatedBy = this.curruser.UserName;
            tusr.Email = b.Email;
            tusr.UserName = b.UserName;
            tusr.CreatedOn = new Date();
            tusr.DisplayName = b.UserName;
            
            ToCreateTempUsrs.push(tusr);
          })
        this.service.createTempUser(ToCreateTempUsrs).subscribe((TempUserInfo:TempUserReturnData[])=>{


        
        let i = 1;
        let arrdocapp: Array<docapp> = new Array<docapp>();

        this.arr1.forEach((a: AllUser) => {
          let signerdocapp: docapp = new docapp();
          signerdocapp.client = a.ClientID!=null?a.ClientID:TempUserInfo.find(fi=>fi.email==a.Email).client;
          signerdocapp.company = a.Company!=null?a.Company:TempUserInfo.find(fi=>fi.email==a.Email).company;
          signerdocapp.docId = this.viewDocId;
          signerdocapp.level = i.toString();
          if (i == 1) {
            signerdocapp.type = "nxtsign";
          }
          else {
            signerdocapp.type = "notsinged";
          }
          signerdocapp.user = a.UserName;
          arrdocapp.push(signerdocapp);
          i++;

        })
      

        this.service.postdatatodocapp(arrdocapp).subscribe(() => {

          let arrcreatedoc: Array<createdoc> = new Array<createdoc>();

          let crdoc = this.addDocH(this.curruser.ClientID, this.curruser.Company, this.viewDocId, this.viewDocH.createdBy, this.viewDocH.modifiedBy);
          arrcreatedoc.push(crdoc);

          this.service.updateDoch(arrcreatedoc).subscribe(() => {
            let dTag: DocTag = new DocTag();
            if(this.dtag!=null){
              
            dTag.client = this.dtag.client;
            dTag.company = this.dtag.company;
            dTag.docId = this.dtag.docId;

            let indx = this.TagKeys.find(x=>x.tagName==this.Tag.value);
            dTag.tagId = indx==null?"" :indx.tagID;
            dTag.tagName = this.Tag.value;
            this.updateTag(dTag);
            }else{
              let ctag: DocTag = new DocTag();
              ctag.client = this.curruser.ClientID;
              ctag.company = this.curruser.Company;
              ctag.docId = this.viewDocId;
              let indx = this.TagKeys.find(x=>x.tagName==this.Tag.value);
              ctag.tagId = indx==null?"" :indx.tagID;
              ctag.tagName = this.Tag.value;
              this.createTag(ctag);
            }
            
            
              let log:DocAppLog = new DocAppLog();
              log.client = this.curruser.ClientID;
              log.company = this.curruser.Company;
              log.date = new Date();
              log.time = "";
              log.user = this.curruser.DisplayName;
              log.action = "created";
              log.seqNo = "";
              log.locHostName ="";
              log.internetIp = this.IP_address;
              log.locMachineId = this.MAC_address;
              log.commnets = this.remark.value;
              log.singId = "created";
              log.singLog ="";
              log.signType ="";
              log.docId = this.viewDocId;

              this.service.updateLog(log).subscribe(()=>{
                
              })
              if (this.changeinFiles > 0) {
                this.UpdatePostgres();
              }
              else {
                if(this.releasedocFlag){
                  let releaseADoc: ReleaseDocParams = new ReleaseDocParams();
                  releaseADoc.Client = this.curruser.ClientID;
                  releaseADoc.Company = this.curruser.Company;
                  releaseADoc.DocID = this.viewDocId;
                  releaseADoc.Status = "Released";
                  this.service.releaseDoc(releaseADoc).subscribe(() => {
                    
                    this.snackbar.openSnackBar("Document created successfully", SnackBarStatus.success, 2000);
                          this.hidespin = false
                    this.router.navigate(["/page/dashboard"]);
                  })
                 }
                 else{
                   
                  this.snackbar.openSnackBar("Document created successfully", SnackBarStatus.success, 2000);
                  this.hidespin = false
            this.router.navigate(["/page/dashboard"]);
                 }
              }
            

            //
          })
        })


      })
      })

    }
    else {
      this.formdata = new FormData();
      this.date = new Date();

      this.files1.forEach(f => {
        this.formdata.append(f.name, f, f.name);
      })


      this.service.postfiletoPostGres(this.formdata).subscribe((l: any) => {
        const attids: string[] = l;
        console.log(l);


        console.log("l", l);
        let att: Array<docatt> = new Array<docatt>();
        attids.forEach(a => {
          let t: docatt = new docatt();
          t.Company = this.curruser.Company;
          t.Client = this.curruser.ClientID;
          t.Type = 'pdf';
          t.AttId = a;
          t.AttId1 = "";
          t.User = this.curruser.UserName;
          t.Signed = "";

          att.push(t);
        })
        // let i = 1;
        // this.arr1.forEach((a: AllUser) => {
        //   attids.forEach(b => {
        //     if(a.ClientID!=this.curruser.ClientID){
        //       let t: docatt = new docatt();
        //     t.Company = a.Company;
        //     t.Client = a.ClientID;
        //     t.Type = "pdf";
        //     t.AttId = b;
        //     t.AttId1 = "";
        //     t.User = a.UserName;
        //     t.Signed = ""
        //     att.push(t);
        //     }
        //   })
        // })
        console.log("completed doc upload to postgres");
        // this.snackbar.openSnackBar("Please Wait..",SnackBarStatus.warning,2000);
        this.service.postdatatodocatt(att).subscribe((m: any) => {
          let tempid: string[] = m
          let DocId = tempid[0];
          console.log(m);
          let arrcreatedoc: Array<createdoc> = new Array<createdoc>();

          let crdoc = this.addDocH(this.curruser.ClientID, this.curruser.Company, DocId, this.curruser.DisplayName, this.curruser.UserName);
          arrcreatedoc.push(crdoc);
          // this.arr1.forEach((a:AllUser)=>{


          //   let crsigners = this.addDocH(a.ClientID,a.Company,DocId,this.curruser.UserName,this.curruser.UserName);
          //   arrcreatedoc.push(crsigners);
          // })

          console.log(arrcreatedoc);
          console.log("completed creating doctt");
          this.service.postdatatoDocH(arrcreatedoc).subscribe((n: any) => {
            console.log("completed creating doch ");

            let arrdocapp: Array<docapp> = new Array<docapp>();
            let ownerdocapp: docapp = new docapp();
            ownerdocapp.client = this.curruser.ClientID;
            ownerdocapp.company = this.curruser.Company;
            ownerdocapp.docId = DocId;
            ownerdocapp.level = "0";
            ownerdocapp.type = "owner";
            ownerdocapp.user = this.curruser.UserName;
            arrdocapp.push(ownerdocapp);
           
            let ToCreateTempUsrs:UserWithRole[] =[];

          this.ArrTempUsers.forEach(b=>{
            let tusr = new UserWithRole();
            
            tusr.Company = this.curruser.Company;
            tusr.CreatedBy = this.curruser.UserName;
            tusr.Email = b.Email;
            tusr.UserName = b.UserName;
            tusr.CreatedOn = new Date();
            tusr.DisplayName = b.UserName;
            
            ToCreateTempUsrs.push(tusr);
          })
            
            // creating temp user
            this.service.createTempUser(ToCreateTempUsrs).subscribe((TempUserInfo:TempUserReturnData[])=>{
              
            
            let i = 1;
            this.arr1.forEach((a: AllUser) => {
              let signerdocapp: docapp = new docapp();
              signerdocapp.client = a.DisplayName!=null?a.DisplayName:TempUserInfo.find(fi=>fi.email==a.Email).client;
              signerdocapp.company = a.Company!=null?a.Company:TempUserInfo.find(fi=>fi.email==a.Email).company;
              signerdocapp.docId = DocId;
              signerdocapp.level = i.toString();
              if (i == 1) {
                signerdocapp.type = "nxtsign";
              }
              else {
                signerdocapp.type = "notsinged";
              }
              signerdocapp.user = a.UserName;
              arrdocapp.push(signerdocapp);
              i++;

            })
            let ctag: DocTag = new DocTag();
            ctag.client = this.curruser.ClientID;
            ctag.company = this.curruser.Company;
            ctag.docId = DocId;
            let indx = this.TagKeys.find(x=>x.tagName==this.Tag.value);
            ctag.tagId = indx==null?"" :indx.tagID;
            ctag.tagName = this.Tag.value;
            this.createTag(ctag);

            let log:DocAppLog = new DocAppLog();
            log.client = this.curruser.ClientID;
            log.company = this.curruser.Company;
            log.date = new Date();
            log.time = "";
            log.user = this.curruser.DisplayName;
            log.action = "created";
            log.seqNo = "";
            log.locHostName ="";
            log.internetIp = this.IP_address;
            log.locMachineId = this.MAC_address;
            log.commnets = this.remark.value;
            log.singId = "created";
            log.singLog ="";
            log.signType ="";
            log.docId = DocId;

            this.service.createLog(log).subscribe(()=>{
              
            })
            
              this.service.postdatatodocapp(arrdocapp).subscribe((p: any) => {
                console.log("completed creating docapp");
                if(this.releasedocFlag){
                  let releaseADoc: ReleaseDocParams = new ReleaseDocParams();
                  releaseADoc.Client = this.curruser.ClientID;
                  releaseADoc.Company = this.curruser.Company;
                  releaseADoc.DocID = DocId;
                  releaseADoc.Status = "Released";

                  this.createDistMails(DocId,TempUserInfo);
                  this.service.releaseDoc(releaseADoc).subscribe(() => {
                    
                    this.snackbar.openSnackBar("Document created successfully", SnackBarStatus.success, 2000);
                    this.spinner.hide();
                    this.router.navigate(["/page/dashboard"]);
                  })
                 }
                 else{
                   
                  this.snackbar.openSnackBar("Document created successfully", SnackBarStatus.success, 2000);
                  this.spinner.hide();
            this.router.navigate(["/page/dashboard"]);
                 }
              },
                err => {
                  this.spinner.hide();
                  this.snackbar.openSnackBar("Went wrong while creating document!", SnackBarStatus.danger, 2000);
                })
            
            //
          })


          },
            err => {
              this.spinner.hide();
              this.snackbar.openSnackBar("Went wrong while creating document!", SnackBarStatus.danger, 2000);
            })

        })
      },
        err => {
          this.spinner.hide();
          this.snackbar.openSnackBar("Went wrong while uploading files!", SnackBarStatus.danger, 2000)
        }
      )
    }
    this.spinner.hide();
  }
  else {
    this.spinner.show();
    this.Title.markAsTouched();
    this.Title.markAsDirty();
    this.Tag.markAsTouched();
    this.Tag.markAsDirty();
    // this.toppings.markAsDirty();
    // this.toppings.markAsTouched();
    // this.toppings.errors.required;
    this.dueDate.markAsTouched();
    if(this.files1.length<=0){
      this.spinner.hide();
      this.snackbar.openSnackBar("Files Required!", SnackBarStatus.danger, 2000)
    }
    if(this.arr1.length <=0){
      this.spinner.hide();
      this.snackbar.openSnackBar("Users Required !", SnackBarStatus.danger, 2000)
    }
    // this.Refctrl.markAsDirty();
    this.refno.markAsTouched();
    this.remark.markAsDirty();
    this.spinner.hide();
  }
}
get hasDropDownError() {
  return (
    this.toppings.touched &&
    this.toppings.errors &&
    this.toppings.errors.required
  )
}
get hasDropDownError1() {
  return (
    this.Refctrl.touched &&
    this.Refctrl.errors &&
    this.Refctrl.errors.required
  )
}

get f() {

  return this.form.get('email');
}
// createDistMails(DocId:string,TempUserInfo:TempUserReturnData[]){
// let Distmails = new Array<DocDistMail>();
// if(this.selectedData.RecieveEmailConfig=="init"){
// let dmail = new DocDistMail();
// dmail.Client = this.curruser.ClientID;
// dmail.Company = this.curruser.Company;
// dmail.DocId = DocId;
// dmail.MailId = this.curruser.EmailAddress;
// Distmails.push(dmail);
// }
// else if(this.selectedData.RecieveEmailConfig=="allusers"){
// let dmail = new DocDistMail();
// this.arr1.forEach(k=>{
// let dmail = new DocDistMail();
// dmail.Client = k.ClientID!=null?k.ClientID:TempUserInfo.find(fi=>fi.email==k.Email).client;
// dmail.Company = k.Company!=null?k.Company:TempUserInfo.find(fi=>fi.email==k.Email).company;
// dmail.DocId = DocId;
// dmail.MailId = k.Email;
// Distmails.push(dmail);
// })

// dmail.Client = this.curruser.ClientID;
// dmail.Company = this.curruser.Company;
// dmail.DocId = DocId;
// dmail.MailId = this.curruser.EmailAddress;
// Distmails.push(dmail);

// }
// else if(this.selectedData.RecieveEmailConfig=="custom"){
// this.selectedData.RecieveEmailDef.forEach(k=>{
//   let dmail = new DocDistMail();
//   dmail.Client = k.ClientID!=null?k.ClientID:TempUserInfo.find(fi=>fi.email==k.Email).client;
//   dmail.Company = k.Company!=null?k.Company:TempUserInfo.find(fi=>fi.email==k.Email).company;
//   dmail.DocId = DocId;
//   dmail.MailId = k.Email;
//   Distmails.push(dmail);
// })

// }

// console.log('Distmails');
// this.service.postdatatoDistMail(Distmails).subscribe(k=>{

// })
// }
CreateActionLogvalues(text): void {
  this.ActionLog = new ActionLog();
  this.ActionLog.UserID = this.curruser.UserID;
  this.ActionLog.AppName = "DocumentCenter";
  this.ActionLog.ActionText = text + " is Clicked";
  this.ActionLog.Action = text;
  this.ActionLog.CreatedBy = this.curruser.UserName;
  this._authservice.CreateActionLog(this.ActionLog).subscribe(
      (data) => {
          console.log(data);
      },
      (err) => {
          console.log(err);
      }
  );
}
createDistMails(DocId:string,TempUserInfo:TempUserReturnData[]){
  let Distmails = new Array<DocDistMail>();
  if(this.selectedData.RecieveEmailConfig=="init"){
    let dmail = new DocDistMail();
    dmail.Client = this.curruser.ClientID;
    dmail.Company = this.curruser.Company;
    dmail.DocId = DocId;
    dmail.MailId = this.curruser.EmailAddress;
    Distmails.push(dmail);
  }
  else if(this.selectedData.RecieveEmailConfig=="allusers"){
  let dmail = new DocDistMail();
  this.arr1.forEach(k=>{
    let dmail = new DocDistMail();
    dmail.Client = k.ClientID!=null?k.ClientID:TempUserInfo.find(fi=>fi.email==k.Email).client;
    dmail.Company = k.Company!=null?k.Company:TempUserInfo.find(fi=>fi.email==k.Email).company;
    dmail.DocId = DocId;
    dmail.MailId = k.Email;
    Distmails.push(dmail);
  })
  
    dmail.Client = this.curruser.ClientID;
    dmail.Company = this.curruser.Company;
    dmail.DocId = DocId;
    dmail.MailId = this.curruser.EmailAddress;
    Distmails.push(dmail);
  
  }
  else if(this.selectedData.RecieveEmailConfig=="custom"){
    this.selectedData.RecieveEmailDef.forEach(k=>{
      let dmail = new DocDistMail();
      dmail.Client = k.ClientID!=null?k.ClientID:TempUserInfo.find(fi=>fi.email==k.Email).client;
      dmail.Company = k.Company!=null?k.Company:TempUserInfo.find(fi=>fi.email==k.Email).company;
      dmail.DocId = DocId;
      dmail.MailId = k.Email;
      Distmails.push(dmail);
    })
  
  }
  
  console.log('Distmails');
  this.service.postdatatoDistMail(Distmails).subscribe(k=>{
  
  })
  }
createTag(ctag:DocTag){
 console.log(ctag);
 
if(ctag.tagName!="" ){
  this.service.createTag(ctag).subscribe(() => {})
}

}
updateTag(dTag:DocTag){
if(dTag.tagName!="" || dTag.tagName!=null){
  this.service.updateTag(dTag).subscribe(() => {})
}
}
addDocH(Client, Company, did, cb, mb) {

  this.reasonChange()
  // this.newdocid = "vs"+this.date.getDay().toString()+this.date.getMonth().toString()+this.date.getFullYear().toString()+this.date.getHours.toString()+this.date.getMinutes().toString()+this.date.getSeconds().toString()+this.date.getMilliseconds().toString();
  let tempdoc: createdoc = new createdoc();
  tempdoc.distMail=
  tempdoc.client = Client
  tempdoc.company = Company
  tempdoc.docId = did
  tempdoc.title = this.Title.value;
  tempdoc.finalDueDate = this.datepipe.transform((this.dueDate.value),"yyyy-MM-dd");
  tempdoc.signAadhaar = this.signaadhar;
  tempdoc.signCaPfx = this.signcertificate;
  tempdoc.signCaToken = this.singtoken;
  tempdoc.signSelf = this.signvsure;
  tempdoc.signImage = this.signself;
  tempdoc.signCursor =this.signcursor;
  tempdoc.signTag=this.signtag;
  tempdoc.distInit = "No"
  tempdoc.distMail = "No"
  tempdoc.distDms = "No"
  tempdoc.distAll = "No"
  tempdoc.fileName = ""
  tempdoc.fileExt = ""
  tempdoc.fileMd5 = ""
  tempdoc.fileSize = ""
  tempdoc.fileType = ""
  tempdoc.lastSignedBy = "None"
  tempdoc.lastSingedDate = ""
  tempdoc.status = "Draft"
  tempdoc.createdOn = new Date();
  tempdoc.createdBy = cb
  tempdoc.modifiedOn = new Date();
  tempdoc.modifiedBy = mb
  tempdoc.refID = this.Refctrl.value!=""?(this.allRefs.find(c => { return c.refType == this.Refctrl.value }).refID):"";
  tempdoc.remarks = this.remark.value;
  tempdoc.refNumber = this.refno.value;
  console.log(tempdoc);
  return tempdoc;

}

showOptionsfirst(event:any){
if(event.checked==true)
{
  localStorage.setItem("Pages","1_");
}
else{
  localStorage.setItem("Pages","1_");
}
}


showOptionsAll(event:any){
  if(event.checked==true)
  {
    localStorage.setItem("Pages","all");
    console.log(localStorage.setItem("Pages","all"));
  }
  else{
    localStorage.setItem("Pages","1_");
  }
  }
// cancelUpload(id: string): void {
//   this.uploadInput.emit({ type: 'cancel', id: id });
// }

// removeFile(id: string): void {
//   this.uploadInput.emit({ type: 'remove', id: id });
// }

// removeAllFiles(): void {
//   this.uploadInput.emit({ type: 'removeAll' });
// }

openAttachmentViewDialog(index:any): void {
 
let fileType =this.files1[index].name.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
const blob = new Blob([this.files1[index]], { type: fileType });
if(fileType=='application/pdf'){
  this.openAttachmentDialog(this.files1[index].name, blob);
  console.log(blob);

}
}
openAttachmentDialog(filename:any,blob:any):void{
  const dialogConfig: MatDialogConfig = {
    data: { FileName: filename,blob:blob, isResponse: true },
    width: '75%',
    // height: '85%',
    panelClass: "attachment-view-dialog",
  };
  const dialogRef = this.Dialog.open(
   AttachmentviewComponent,
    dialogConfig
  );

}
}
class DocFormData {

DocId: string
FileName: string
Files: Uint8Array;
FileType: string
Field1: string
Field2: string
Field3: string
}
