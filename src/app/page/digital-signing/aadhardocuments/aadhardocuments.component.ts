import { Component, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { ChangeDetectorRef, Sanitizer, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { digital } from '../signing';
import { SignatureService } from '../signature.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SigndocumentComponent } from '../signdocument/signdocument.component';
 import { GetattachmentdetailsService } from '../../new-doucument/getattachmentdetails.service';
import { DocAtt } from '../Model/DocAtt.model';
import { DocReturnData } from '../Model/returnfile.model';
import { SignandUpdatedocService } from '../signandupdatedoc.service';
import { FilenameAndDocIDs } from '../Model/FilenamesandAttIDs.model';
import { RetImg } from '../Model/retdata.model';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'src/app/models/master';
import * as FileSaver from 'file-saver';
import { DocAttanRemarks } from '../Model/DocAttandRemarks.model';
import { OwnerRemarksComponent } from '../owner-remarks/owner-remarks.component';
import { PopUpReturnData } from '../Model/PopUpReturnData.model';
import { DocAppLog } from '../Model/AppLog.model';
import { SignByUserResponse } from '../Model/SignByUserResponse.model';
import { GetattachmentdetailsService1 } from '../getattachmentdetails.service1';
import { EventEmitter } from 'events';
import { HttpClient, HttpEventType } from '@angular/common/http';
declare const GetPdfImages:any;
declare var require :any;
const FileSaver = require('file-saver');
import { saveAs } from 'file-saver';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { FileDocID } from '../Model/FileDocID.model';
import { DocumentService } from '../../new-doucument/document.service';
@Component({
  selector: 'app-aadhardocuments',
  templateUrl: './aadhardocuments.component.html',
  styleUrls: ['./aadhardocuments.component.scss'],
  encapsulation: ViewEncapsulation.None,

})

export class AadhardocumentsComponent implements OnInit {
  public MAX_SIZE: any = 1048576;
  public msg: string;
  public progress:number;
  theFile: any = null;
  messages: string[] = [];
  
  @Output() public onuploadfinished =new EventEmitter();
  FileNames: FilenameAndDocIDs[] = []
  docattandRmrks: DocAttanRemarks;
  logDatas: DocAppLog[];
  docatt: DocAtt[];
  lengthLogData;
  ownerRmrks: string;
  DocAuthor: string = ""
  lastassign: any;
  DisplayDocName = "";
  clientID = "";
  createdOnDate = "";
  completeByDate = "";
  FetchedDocID ="";
  @ViewChild('pdfViewerAutoLoad') pdfViewerAutoLoad;
  returnfile: DocReturnData = new DocReturnData();
  requiredfile: File;
  fsrc: any;
  AttIDs: string[];
  isProgressBarVisibile = false;
  curruser: AuthenticationDetails;
  selectedoptionfromdialog: string = "";
  totalPages: any;
  selectedFilename: Array<FilenameAndDocIDs> = Array<FilenameAndDocIDs>();
  selectedData: PopUpReturnData = new PopUpReturnData();
  imgSrc: any;
  hidespin = false;
  temp: FormData;


  hideSignbutton = true;
  digital1: digital[];
  
  flag: boolean = false;
  signaturePad: any;
  displayname: string = "";
  displayDueDate: string = "";
  displayDate: string = ""
  flag1: boolean = false;
  mode = '';
  mode1 = '';
  mode2 = '';
  mode3 = '';
  mode4 = '';
  mode5 = '';
  imageSrc = '';
  fulfill: any;
  images = [];
  color = 'primary';
  modespin = 'indeterminate';
  messageText = '';
  form: FormGroup;
  signatureImage: any;
  toSignFiles: File[] = [];
  DocID: string;
  docID:string;
  presentFilnamr: FilenameAndDocIDs;
  length: FilenameAndDocIDs[];
  defaultindex = 0;
  files: any;
  // file1:File;
  constructor(public dialog: MatDialog,private dialogRef:MatDialogRef<AadhardocumentsComponent>,
     private fb: FormBuilder, private router: Router, private docService: DocumentService, private cd: ChangeDetectorRef, private sanitizer: DomSanitizer, private signservice: SignatureService, private GetsignService: SignandUpdatedocService, private Dialog: MatDialog, private attachmentdetails: GetattachmentdetailsService1,private http:HttpClient, @Inject(MAT_DIALOG_DATA) data) {
    this.form = this.fb.group({
      fns: this.fb.array([])
    });
    this.displayname = localStorage.getItem("displayName");
    this.displayDueDate = localStorage.getItem("completedby");
    this.createdOnDate = localStorage.getItem("CreatedOn")
    this.completeByDate = localStorage.getItem("completedby")


    this.displayDate = new Date().toString();
    localStorage.removeItem("viewClient");
    localStorage.removeItem("viewCompany");
    localStorage.removeItem("viewDocId");
    localStorage.removeItem("forUpdating")
    localStorage.removeItem("fulfilmentSave");
    this.curruser = JSON.parse(localStorage.getItem("authorizationData"));
    this.lastassign = [{
      date: "03/05/2020",
      name: "Raahul"
    }, {
      date: "03/05/2020",
      name: "Suriya"
    },
    {
      date: "03/05/2020",
      name: "Suriya"
    }];
  }

  dynamicimgs: any[] = []
  thumbnail: any[] = [];

  images1: any = { src: '../../assets/image/vsign/letter.png' }

  showImage(data) {
    this.signatureImage = data;
  }
  Onpen() {
    this.flag = true;
  }

  private readAndUploadFile(theFile: any) {
  
    // this.attachmentdetails.getAttachmentPosgresql(theFile[0].docID).subscribe((x: DocReturnData) => {
    //   const dblob = this.dataURItoBlob(x.files);
    //   const dfile = new File([dblob], x.fileName, { type: x.fileType });
    //   FileSaver.saveAs(dfile);
    // })
//     let file = new fileToUpload();
// console.log(this.files);

   
//     file.fileName = theFile.fname;
//     file.fileSize = theFile.docID;
//     file.fileType = theFile.type;
   
    // file.lastModifiedTime = theFile.lastModified;
    // file.lastModifiedDate = theFile.lastModifiedDate;
    
    // Use FileReader() object to get file to upload
    // NOTE: FileReader only works with newer browsers
    
    // let reader = new FileReader();
    // // Setup onload event for reader
    // reader.onload = () => {
    //     // Store base64 encoded representation of file
    //      file.fileAsBase64 = reader.result.toString();
        
    //     // POST to server
    //     this.uploadService.uploadFile(file).subscribe(resp => { 
    //         this.messages.push("Upload complete"); });
    // }
    
    // Read the file
    // reader.readAsDataURL(this.files);
}
uploadFile(fn:any): void {
  console.log(fn)
  this.theFile=fn;
  console.log(this.theFile);
  
  this.readAndUploadFile(this.theFile);
}


  ngOnInit(): void {
    // this.GetPdfImages();
    this.fulfill = localStorage.getItem('fulfilment');
    console.log(this.fulfill);
    
    const client = localStorage.getItem("Selectedclient");
    this.DocAuthor = localStorage.getItem("Author");
    console.log("client", client);
    const company = localStorage.getItem("Selectedcompany");
    const docId = localStorage.getItem("SelecteddocId");
    this.DocID = docId;
    const com_client = localStorage.getItem("completeclient");
    const com_company = localStorage.getItem("completecompany");
    const com_docId = localStorage.getItem("completedocId");
    this.length =this.FileNames;

    if (client != null && company != null && docId != null) {
      this.hidespin = true
      this.clientID = client
      this.attachmentdetails.getAttachmentDetails(client, company, docId).subscribe(
        (data) => {
          console.log(data);

          this.hideSignbutton = localStorage.getItem("hideSign") == "Yes" ? false : true;
          this.docattandRmrks = data;
          this.docatt = this.docattandRmrks.doc;
          this.logDatas = this.docattandRmrks.logDatas;
          this.lengthLogData = this.logDatas.length;
          this.lengthLogData = this.lengthLogData - 1;
          this.ownerRmrks = this.docattandRmrks.docRemarks;
          this.AttIDs = [];
          this.docatt.forEach(k => {
            this.AttIDs.push(k.attId);
          })
          console.log(this.docatt)
          this.attachmentdetails.getFnamesAndIds(this.AttIDs).subscribe((h: FilenameAndDocIDs[]) => {
            this.FileNames = h;
            console.log(h)
            this.selectedFilename.push(this.FileNames[0]);
            this.attachmentdetails.getPdfImg(this.FileNames[0].docID, (1).toString()).subscribe((b) => {
              let firstimg: RetImg = b as RetImg;
              localStorage.setItem(this.FileNames[0].docID + "img_" + 1, firstimg.b64string);
              const imgblob = this.dataURItoBlob(firstimg.b64string);
              let furl = URL.createObjectURL(imgblob);
              this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(furl);
              this.onClickFileName(0)
              this.hidespin = false;
              // this.attachmentdetails.getAttachmentPosgresql(this.FileNames[0].docID).subscribe((w: DocReturnData) => {
              //   const flblob = this.dataURItoBlob(w.files);
              //   let pdf_fileurl = URL.createObjectURL(flblob);
              //   localStorage.setItem(this.presentFilnamr.docID + "_pdf", pdf_fileurl);
              //   GetPdfImages(pdf_fileurl).then((x) => {
              //     // console.log(x);
              //     this.thumbnail.push(...x);


              //   });
              // })
            })
            // this.attachmentdetails.getAttachmentPosgresql(this.docatt[0].attId).subscribe(
            //   (data1) => {

            //     this.returnfile = data1;
            //     console.log("data1", this.returnfile);
            //     console.log(this.returnfile.files);
            //     const fileblob = this.dataURItoBlob(this.returnfile.files);
            //   }
            // )
          })

        }
      )
    }
    else {
      this.hidespin = true
      this.clientID = com_client;
      this.attachmentdetails.getAttachmentDetails(com_client, com_company, com_docId).subscribe(
        (data) => {
          this.hideSignbutton = localStorage.getItem("hideSign") == "Yes" ? false : true;
          this.docattandRmrks = data;
          this.docatt = this.docattandRmrks.doc;
          this.logDatas = this.docattandRmrks.logDatas;
          this.lengthLogData = this.logDatas.length;
          this.lengthLogData = this.lengthLogData - 1;
          this.ownerRmrks = this.docattandRmrks.docRemarks;
          this.AttIDs = [];
          this.docatt.forEach(k => {
            this.AttIDs.push(k.attId1);
          })
          console.log(this.docatt)
          this.attachmentdetails.getFnamesAndIds(this.AttIDs).subscribe((h: FilenameAndDocIDs[]) => {
            this.FileNames = h;
            console.log(h)
            this.selectedFilename.push(this.FileNames[0]);
            this.attachmentdetails.getPdfImg(this.FileNames[0].docID, (1).toString()).subscribe((b) => {
              let firstimg: RetImg = b as RetImg;
              localStorage.setItem(this.FileNames[0].docID + "img_" + 1, firstimg.b64string);
              const imgblob = this.dataURItoBlob(firstimg.b64string);
              let furl = URL.createObjectURL(imgblob);
              this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(furl);
              this.onClickFileName(0)
              this.hidespin = false;
              //  this.attachmentdetails.getAttachmentPosgresql(this.FileNames[0].docID).subscribe((w:DocReturnData)=>{
              //   const flblob = this.dataURItoBlob(w.files);
              //   let pdf_fileurl = URL.createObjectURL(flblob);
              // localStorage.setItem(this.FileNames[0].docID+"_pdf",pdf_fileurl);
              //   GetPdfImages(pdf_fileurl).then((x) => {
              //     // console.log(x);
              //     this.thumbnail.push(...x);


              //   });
              //  })
            })
            //  this.attachmentdetails.getAttachmentPosgresql(this.docatt[0].attId).subscribe(
            //   (data1) => {

            //     this.returnfile = data1;
            //     console.log("data1", this.returnfile);
            //     console.log(this.returnfile.files);
            //     const fileblob = this.dataURItoBlob(this.returnfile.files);
            //   }
            // )
          })
        }
      )
    }



    // this.images.push(this.imageButtons);
    // console.log(this.images);

    // this.imageButtons[0];

  }
  updateFNS(chk, isChecked) {
    const chkArr = <FormArray>this.form.get('fns');
    console.log(chk, isChecked);
    if (isChecked) {
      if (chkArr.controls.findIndex(x => x.value == chk.docID) < 0) {
        chkArr.push(new FormControl({ docID: chk.docID }));
        this.selectedFilename.push(chk);
      }

    }
    else {
      console.log(chk, isChecked);
      let idx = chkArr.controls.findIndex(x => x.value == chk.docID);
      chkArr.removeAt(idx)
      this.selectedFilename.splice(idx);
    }
    console.log(this.selectedFilename);

  }
  onClickFileName(fn:number){
    console.log(fn);
    this.defaultindex = fn;
    this.dynamicimgs=[];
    this.presentFilnamr=this.FileNames[this.defaultindex];
    this.DisplayDocName = this.presentFilnamr.fname;
    console.log(fn);
    this.thumbnail = [];
    this.hidespin=true;
    if(localStorage.getItem(this.presentFilnamr.docID+"_pdf")===null){
     this.attachmentdetails.getAttachmentPosgresql(this.presentFilnamr.docID).subscribe((w:DocReturnData)=>{
       const flblob = this.dataURItoBlob(w.files);
       let pdf_fileurl = URL.createObjectURL(flblob);
      
     localStorage.setItem(this.presentFilnamr.docID+"_pdf",pdf_fileurl);
       GetPdfImages(pdf_fileurl).then((x) => {
         // console.log(x);
         this.thumbnail.push(...x);
    
         
       });
      })
    }
    else{
     GetPdfImages(localStorage.getItem(this.presentFilnamr.docID+"_pdf")).then((x) => {
       // console.log(x);
       this.thumbnail.push(...x);
  
       
     });
    }
    if(localStorage.getItem(this.presentFilnamr.docID+"img_"+1)===null){
     this.attachmentdetails.getPdfImg(this.presentFilnamr.docID,(1).toString()).subscribe((b)=>{
       let firstimg:RetImg = b as RetImg;
       localStorage.setItem(this.presentFilnamr.docID+"img_"+1,firstimg.b64string);
       const imgblob= this.dataURItoBlob(firstimg.b64string);
       let furl=URL.createObjectURL(imgblob);
       this.imgSrc=this.sanitizer.bypassSecurityTrustResourceUrl(furl);
       this.hidespin=false
     })
    }
    else{
     const imgblob= this.dataURItoBlob(localStorage.getItem(this.presentFilnamr.docID+"img_"+1));
     let furl=URL.createObjectURL(imgblob);
     this.imgSrc=this.sanitizer.bypassSecurityTrustResourceUrl(furl);
     this.hidespin=false;
    }

    
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
  onClick(i: number) {

    this.flag1 = true;
    this.hidespin = true
    if (localStorage.getItem(this.presentFilnamr.docID + "img_" + (i + 1).toString()) != null) {
      const imgblob = this.dataURItoBlob(localStorage.getItem(this.presentFilnamr.docID + "img_" + (i + 1).toString()));
      let furl = URL.createObjectURL(imgblob);
      this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(furl);
      this.hidespin = false
    }
    else {
      this.attachmentdetails.getPdfImg(this.presentFilnamr.docID, (i + 1).toString()).subscribe((b) => {
        let firstimg: RetImg = b as RetImg;
        localStorage.setItem(this.presentFilnamr.docID + "img_" + (i + 1).toString(), firstimg.b64string);
        const imgblob = this.dataURItoBlob(firstimg.b64string);
        let furl = URL.createObjectURL(imgblob);
        this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(furl);
        this.hidespin = false;
      })
    }
  }
  submit(){

  }
//   upload() 
//   {
//     console.log("upload calls");
   
// this.files=this.FileNames;

//     if (this.files.length===0)
//     return;
//     let fileToUpload=<FilenameAndDocIDs[]>this.files;
//     const formData = new FormData();
//      this.attachmentdetails.getAttachmentPosgresql(this.FileNames[this.defaultindex].docID).subscribe((x: DocReturnData) => {
     
//       const dblob = this.dataURItoBlob(x.files);
//       let type0fPDF=x.fileType.split('@@')[0].toString();
//       const dfile = new File([dblob], x.fileName, { type: "application/pdf" });
//       formData.append(dfile.name, dfile,dfile.name);
      
//      let fd: FileDocID = new FileDocID();
//      fd.sfile = dfile; 

//       this.http.post<any>('http://localhost:44388/api/SignDoc/Upload',formData)
//     .subscribe(ev => {
//          fd.FDocID=ev.fileID;
//           this.msg='success';
          
//           this.dialogRef.close(fd);
          
//           this.FetchedDocID 
      
//     });
//       // console.log(this.FileNames[i]);
//     });
//   //   var file = new Blob([
     
//   //  ], { type: 'application/pdf' });
 
   
//     // this.files.forEach(x => {
//     //   formData.append('any', x.files,x.fname);
//     //     });
    
    
    
//   }

upload() 
  {
    console.log("upload calls");
   
this.files=this.FileNames;

    if (this.files.length===0)
    return;
    let fileToUpload=<FilenameAndDocIDs[]>this.files;
    const formData = new FormData();
     this.attachmentdetails.getAttachmentPosgresql(this.FileNames[this.defaultindex].docID).subscribe((x: DocReturnData) => {
     
      const dblob = this.dataURItoBlob(x.files);
      let type0fPDF=x.fileType.split('@@')[0].toString();
      const dfile = new File([dblob], x.fileName, { type: "application/pdf" });
      formData.append(dfile.name, dfile,dfile.name);
      
     let fd: FileDocID = new FileDocID();
     fd.sfile = dfile; 

      this.http.post<any>('http://192.168.0.25:5055/api/SignDoc/Upload',formData)
    .subscribe(ev => {
         fd.FDocID=ev.fileID;
          this.msg='success';
          
          this.dialogRef.close(fd);
          
          this.FetchedDocID 
      
    });
  })
}
  upload1()

  {
    // const link=document.createElement('a');
    // link.setAttribute('target','_blank');
    // link.setAttribute('href','abc.net/files/test.ino');
    // link.setAttribute('download','prodcts.csv');
    // document.body.appendChild(link);
    // link.click();
    // link.remove();
    // FileSaver.saveAs(File)
    const pdfUrl=this.selectedFilename[0].docID;
    const pdfName=this.selectedFilename[0].fname;
    FileSaver.saveAs(pdfName,pdfUrl);
    // this.attachmentdetails.getAttachmentPosgresql(this.FileNames[i].docID).subscribe((a: DocReturnData)=>{
    // const dblob = this.dataURItoBlob(a.files);
    // const dfile = new File([dblob], a.fileName, { type: a.fileType });
    // FileSaver.saveAs(dfile);
  // })
}
  onClickDownload(i: number) {
    console.log(this.selectedFilename[i]);
    
    this.attachmentdetails.getAttachmentPosgresql(this.FileNames[i].docID).subscribe((x: DocReturnData) => {
      const dblob = this.dataURItoBlob(x.files);
      const dfile = new File([dblob], x.fileName, { type: x.fileType });
      FileSaver.saveAs(dfile);
    })

  }
  }

