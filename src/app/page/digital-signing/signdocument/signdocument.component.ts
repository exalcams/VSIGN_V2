import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AadhardocumentsComponent } from '../aadhardocuments/aadhardocuments.component';
import { FileDocID } from '../Model/FileDocID.model';
import { PopUpReturnData } from '../Model/PopUpReturnData.model';
import { SignaturePadorImgComponent } from '../signature-pador-img/signature-pador-img.component';

@Component({
  selector: 'app-signdocument',
  templateUrl: './signdocument.component.html',
  styleUrls: ['./signdocument.component.scss']
})
export class SigndocumentComponent implements OnInit {
  selected1 = 'option2';
  selectedoption: string;
  returndata: string;
  inputfromcustom: string;
   signpopform:FormGroup
  form: FormGroup;
  sgnImg:string;
  sgnSelf:string;
  hideTagField = false;
  sgnAadhar:string;
  sgnToken:string;
  sgnCursor:string;
  sgnTag:string;
  sgnCert:string;
  nofselected:string;
  pageSelection = true;
  returnInfo:PopUpReturnData = new PopUpReturnData();
  selfImgData:string;
  Attachment: any;
  aadharDocid:string;
  constructor(private fb: FormBuilder,private Dialog: MatDialog ,private router:Router,private dialogRef1: MatDialogRef<AadhardocumentsComponent>,public dialogRef: MatDialogRef<SigndocumentComponent>, @Inject(MAT_DIALOG_DATA) data) {
   this.sgnAadhar = data.sgnAadhar;
   this.sgnCert = data.sgnCert;
   this.sgnImg = data.sgnImg;
   this.sgnSelf = data.sgnSelf;
   this.sgnToken = data.sgnToken;
   this.sgnCursor = data.sgnCursor;
   this.sgnTag =data.sgnTag;
   this.nofselected = data.nofselected
   this.signpopform = this.fb.group({
    position: ['Page'],
    selectedoption:['first'],
    inputfromcustom:[''],
    signMethod:[''],
    remarks:[''],
    Tagname:['']
   })
   this.signpopform.get("inputfromcustom").disable();
  }

  ngOnInit() {
    this.signpopform.get("selectedoption").valueChanges.subscribe(x=>{
      if(x==="custom"){
        this.signpopform.get("inputfromcustom").enable();
      }
      else{
        this.signpopform.get("inputfromcustom").disable();
      }
      
    })
    this.signpopform.get("position").valueChanges.subscribe(x=>{
      if(x==="Page"){
        this.pageSelection = true;
        this.hideTagField = false;
      }
      else if(x==="Tag"){
        this.pageSelection = false;
        this.hideTagField = true;
      }
    })
    // this.form = this.fb.group({
    //   firstpage: [''],
    //   lastpage: [''],
    //   allpages: [''],
    //   custom: ['']

    // });
  }
  OpenCursor(){
    this.dialogRef.close();
    this.router.navigate(["/pages/cursor"]);
  }
  signdocument() {
    // this.dialogRef.close();
    console.log(this.selectedoption);
    if(this.signpopform.get("selectedoption").value === "first"){
      this.returndata = "1_";
    }
    else if(this.signpopform.get("selectedoption").value === "last"){
      this.returndata = "last";
    }
    else if(this.signpopform.get("selectedoption").value === "all"){
      this.returndata = "all";
    }
    else{
      this.returndata = this.signpopform.get("inputfromcustom").value+"_";
    }
    this.returnInfo.sgnPages=localStorage.getItem("Pages");
    this.returnInfo.sgnByMeans = this.signpopform.get("signMethod").value;
    this.returnInfo.sgnSelfImg = this.selfImgData;
    this.returnInfo.sgnTagName = this.signpopform.get("Tagname").value;
    this.returnInfo.sgnLocation = this.signpopform.get("position").value;
    this.returnInfo.sgnRemarks = this.signpopform.get("remarks").value;
    this.returnInfo.attachment=this.Attachment;
    this.returnInfo.aadharDocID = this.aadharDocid;
  
     this.dialogRef.close(this.returnInfo);
    console.log(this.returnInfo);
    
  }


  OpenSignaturePad(){
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = false;
    dialogconfig.autoFocus = true;
    

    const data = this.Dialog.open(SignaturePadorImgComponent, dialogconfig);
     data.afterClosed().subscribe((x)=>{
       this.selfImgData = x;
     })
  }

  dialogRefclose(){
    this.dialogRef.close();
  }
  OpenAadhar(){
    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = false;
    dialogconfig.autoFocus = true;
    

    const data = this.Dialog.open(AadhardocumentsComponent, dialogconfig);
     data.afterClosed().subscribe((x: FileDocID)=>{
       this.Attachment = x.sfile;
       this.aadharDocid = x.FDocID;
     })
  }

  dialogRefclose1(){
    this.dialogRef1.close();
  }
}


