
import { ChangeDetectorRef, Component, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { digital } from '../signing';
import { SignatureService } from '../signature.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DocAtt } from '../Model/DocAtt.model';
import { DocReturnData } from '../Model/returnfile.model';
import { SignandUpdatedocService } from '../signandupdatedoc.service';
import { FilenameAndDocIDs } from '../Model/FilenamesandAttIDs.model';
import { RetImg } from '../Model/retdata.model';
import { DomSanitizer } from '@angular/platform-browser';
import { SignedAttIDs } from '../Model/AttandAtt1.model';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'src/app/models/master';
import * as FileSaver from 'file-saver';
import { DocAttanRemarks } from '../Model/DocAttandRemarks.model';
import { OwnerRemarksComponent } from '../owner-remarks/owner-remarks.component';
import { PopUpReturnData } from '../Model/PopUpReturnData.model';
import { DocAppLog } from '../Model/AppLog.model';
import { SignByUserResponse } from '../Model/SignByUserResponse.model';
import { GetattachmentdetailsService1 } from '../getattachmentdetails.service1';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { ReleaseDocParams } from '../../new-doucument/models/releaseparam.model';
import { DocumentService } from '../../new-doucument/document.service';
declare const GetPdfImages: any;
@Component({
  selector: 'app-cursor-sign-page',
  templateUrl: './cursor-sign-page.component.html',
  styleUrls: ['./cursor-sign-page.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class CursorSignPageComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
    completed: boolean = true;
  
    defaultindex = 0;
    docattandRmrks: DocAttanRemarks;
    logDatas: DocAppLog[];
    docatt: DocAtt[];
    lengthLogData;
    ownerRmrks: string;
    ActionLog: any;
    DocAuthor: string = ""
    lastassign: any;
    DisplayDocName = "";
    clientID = "";
    createdOnDate = "";
    completeByDate = "";
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
    pdf_fileurl:FormData;
    files: any;
    hideSignbutton = true;
    digital1: digital[];
    FileNames: FilenameAndDocIDs[] = []
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
    presentFilnamr: FilenameAndDocIDs;
    attachmentaadhar: any;
    length: FilenameAndDocIDs[];
    htmlData:any = '';
  htmlString :any = '';
  dfile:File;
  startx;
  starty;
  offsetLeft;
  offsetTop;
  canvasx;
  canvasy;
  locationForm:FormData = new FormData();
  ctx: CanvasRenderingContext2D;
  imgw: any;
  imgh: any;
  drag = false;
  twidth;
  theight;
  inFile :File
  
  last_mousex = 0; last_mousey = 0;
  mousex = 0; mousey = 0;
  img;
  
    constructor(public dialog: MatDialog, private fb: FormBuilder,
      private router: Router, private docService: DocumentService, private cd: ChangeDetectorRef,
      private sanitizer: DomSanitizer, private signservice: SignatureService,
      private GetsignService: SignandUpdatedocService, private Dialog: MatDialog,
      private attachmentdetails: GetattachmentdetailsService1,private httpClient: HttpClient,
      private _authservice: AuthService) {
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
      localStorage.setItem('authorizationData', JSON.stringify(this.curruser));
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
   
  
  
  
    
   
    SendEmail(files: File[], DocID: string, emailIDs: string[]) {
      // let emailadd=["afrinbanu.n@exalca,com","suriya@exalca.com"];
  
      let formFiles: FormData = new FormData();
  
      formFiles.append("DocID", DocID)
      formFiles.append("senderEmail", "")
      let stremail = "";
      emailIDs.forEach(b => {
        stremail = b + "," + stremail
  
      })
      formFiles.append("listemail", stremail);
      files.forEach(k => {
        formFiles.append(k.name, k, k.name);
      })
      this.attachmentdetails.SendConfirmationEmail(formFiles).subscribe(() => {
  
      })
  
  
  
    }
    onAadharwindowclosed(){
     alert("closed")
      
    }
    SentEmail(files: File[], DocID: string) {
      let formFiles: FormData = new FormData();
      this.attachmentdetails.getOneUser(this.clientID).subscribe((h: any) => {
        formFiles.append("DocID", DocID)
        formFiles.append("senderEmail", h.Email)
        files.forEach(k => {
          formFiles.append(k.name, k, k.name);
        })
        this.attachmentdetails.SendConfirmationEmail(formFiles).subscribe(() => {
  
        })
      })
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
      this.length = this.FileNames;
  
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
                localStorage.clear();
                localStorage.setItem('authorizationData', JSON.stringify(this.curruser));
                console.log("afterclear",localStorage.setItem('authorizationData', JSON.stringify(this.curruser)));
                
                this.onClickFileName(0)
                this.hidespin = false;
        
             })
        
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
                localStorage.clear();
                localStorage.setItem('authorizationData', JSON.stringify(this.curruser));
                this.onClickFileName(0)
                this.hidespin = false;
           
              })
            
            })
          }
        )
      }
  
  
  
    
    }
    OpenRemarks(comm: string, user: string) {
      const dialogconfig = new MatDialogConfig();
      dialogconfig.disableClose = false;
      dialogconfig.autoFocus = true;
      comm = comm != 'owner_rmks' ? comm : this.ownerRmrks;
      let givenby = user
      dialogconfig.data = {
        remarks: comm,
        givenby: givenby
      }
      console.log(this.ownerRmrks);
  
      const dialog = this.Dialog.open(OwnerRemarksComponent, dialogconfig);
    }
    onClickDownload(i: number) {
      this.attachmentdetails.getAttachmentPosgresql(this.FileNames[i].docID).subscribe((x: DocReturnData) => {
        const dblob = this.dataURItoBlob(x.files);
        const dfile = new File([dblob], x.fileName, { type: x.fileType });
        FileSaver.saveAs(dfile);
      })
  
    }
    ngAfterViewInit(): void {
      
    }
    mouseup() {
      this.drag = false;
    //  alert(this.last_mousex+","+this.last_mousey+","+this.mousex+","+this.mousey)
    this.locationForm.append("width",this.imgw);
    this.locationForm.append("height",this.imgh);
    this.locationForm.append("x1",this.last_mousex.toString());
    this.locationForm.append("y1",this.last_mousey.toString());
    this.locationForm.append("x2",this.mousex.toString());
    this.locationForm.append("y2",this.mousey.toString());
     this.locationForm.append(this.dfile.name, this.dfile,this.dfile.name);
  
    this.signservice.SignPDFWithCoordinates(this.locationForm).subscribe((o:string)=>{
      let formdata: FormData = new FormData();
     let  nf = new File([this.dataURItoBlob(o)],"n.pdf",{type:"application/pdf"})
      // window.open(URL.createObjectURL(nf));
  
      formdata.append(nf.name, nf, nf.name);
      this.signservice.postfiletoPostGres(formdata).subscribe((l: any) => {
        console.log("posted files to postgres", l);
  
        const attids1: string[] = l;
        let attandatt1: SignedAttIDs = new SignedAttIDs();
        attandatt1.attIds = this.AttIDs;
        attandatt1.attIds1 = attids1;
        this.GetsignService.UpdateAttIds(attandatt1).subscribe(() => {
          console.log("att1 updated");
  
          let releaseADoc: ReleaseDocParams = new ReleaseDocParams();
  
          releaseADoc.DocID = this.DocID;
          releaseADoc.Status = "Completed";
          this.GetsignService.releaseDoc(releaseADoc).subscribe(() => {
            this.isProgressBarVisibile = false;
            // this.SendEmail(emailFiles, this.DocID, emailIDs);
            this.router.navigate(["/pages/center"]);
          })
        })
      })
      
    })
  
    }
  
    mousemove(e) {
    //  console.log("move:",e);
      
      this.mousex = e.pageX - this.canvasx;
      this.mousey = e.pageY - this.canvasy;
      if (this.drag) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); //clear canvas
        this.ctx.drawImage(this.img, 0, 0);
        this.ctx.beginPath();
        this.twidth = this.mousex - this.last_mousex;
        this.theight = this.mousey - this.last_mousey;
        this.ctx.rect(this.last_mousex, this.last_mousey, this.twidth, this.theight);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
  
      }
  
  
  
  
    }
    mousedown(e) {
      console.log("down:",e);
      
      this.last_mousex = e.pageX - this.canvasx;
      this.last_mousey = e.pageY - this.canvasy;
      this.drag = true;
  
    }
  
   
    onClickFileName(fn: number) {
      this.defaultindex = fn;
      this.dynamicimgs=[];
      this.presentFilnamr=this.FileNames[this.defaultindex];
      this.DisplayDocName = this.presentFilnamr.fname;
      console.log(fn);
      this.thumbnail = [];
      this.hidespin = true;
      
      if (localStorage.getItem(this.presentFilnamr.docID + "_pdf") === null) {
        this.attachmentdetails.getAttachmentPosgresql(this.FileNames[this.defaultindex].docID).subscribe((w: DocReturnData) => {
          // const flblob = this.dataURItoBlob(w.files);
          // let pdf_fileurl = URL.createObjectURL(flblob);
  
          // localStorage.setItem(this.presentFilnamr.docID + "_pdf", pdf_fileurl);
          // GetPdfImages(pdf_fileurl).then((x) => {
          //   // console.log(x);
          //   this.thumbnail.push(...x);
  
          this.files=this.FileNames;
  
      if (this.files.length===0)
      return;
      let fileToUpload=<FilenameAndDocIDs[]>this.files;
      const formData = new FormData();
      const dblob = this.dataURItoBlob(w.files);
      let type0fPDF=w.fileType.split('@@')[0].toString();
      this. dfile = new File([dblob], w.fileName, { type: "application/pdf" });
      formData.append(this.dfile.name, this.dfile,this.dfile.name);
      
      // let form:FormData = new FormData();
      // this.inFile = target.files[0];
      // form.append(this.inFile.name,this.inFile,this.inFile.name);
        
          this.signservice.GetPDFImage(formData).subscribe((k:any )=>{
            console.log(k);
            
            this.img = new Image();
      
          this.img.src = URL.createObjectURL(this.dataURItoBlob(k.Base64Img));
          this.ctx = this.canvas.nativeElement.getContext('2d');
          this.img.onload = (x) => {
            let loadedImage: any = x.currentTarget; this.imgh = loadedImage.height; console.log(this.imgh); this.imgw = loadedImage.width; console.log(this.imgw);
            this.ctx.canvas.width = this.imgw;
            this.ctx.canvas.height = this.imgh;
            this.ctx.drawImage(this.img, 0, 0);
            this.canvasx = this.ctx.canvas.offsetLeft;
            this.canvasy = this.ctx.canvas.offsetTop;
          };
          })
  
          // });
        })
      }
      else {
        GetPdfImages(localStorage.getItem(this.presentFilnamr.docID + "_pdf")).then((x) => {
          // console.log(x);
          //this.thumbnail.push(...x);
          
  
  
        });
      }
      // if (localStorage.getItem(this.presentFilnamr.docID + "img_" + 1) === null) {
      //   this.attachmentdetails.getPdfImg(this.presentFilnamr.docID, (1).toString()).subscribe((b) => {
      //     let firstimg: RetImg = b as RetImg;
      //     localStorage.setItem(this.presentFilnamr.docID + "img_" + 1, firstimg.b64string);
      //     const imgblob = this.dataURItoBlob(firstimg.b64string);
      //     let furl = URL.createObjectURL(imgblob);
      //     this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(furl);
      //     this.hidespin = false
      //   })
      // }
      // else {
      //   const imgblob = this.dataURItoBlob(localStorage.getItem(this.presentFilnamr.docID + "img_" + 1));
      //   let furl = URL.createObjectURL(imgblob);
      //   this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(furl);
      //   this.hidespin = false;
      // }
  
  
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
    print(): void {
      window.print();
    }
    afterLoadComplete(count: number): void {
      this.totalPages = count;
      console.log(this.totalPages);
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
    PDFInput(event: EventTarget){
      const eventObj: MSInputMethodContext = event as MSInputMethodContext;
      const target: HTMLInputElement = eventObj.target as HTMLInputElement;
      let form:FormData = new FormData();
      this.inFile = target.files[0];
      form.append(this.inFile.name,this.inFile,this.inFile.name);
      this.signservice.GetPDFImage(form).subscribe((k:any )=>{
        console.log(k);
        
        this.img = new Image();
  
      this.img.src = URL.createObjectURL(this.dataURItoBlob(k.Base64Img));
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.img.onload = (x) => {
        let loadedImage: any = x.currentTarget; this.imgh = loadedImage.height; console.log(this.imgh); this.imgw = loadedImage.width; console.log(this.imgw);
        this.ctx.canvas.width = this.imgw;
        this.ctx.canvas.height = this.imgh;
        this.ctx.drawImage(this.img, 0, 0);
        this.canvasx = this.ctx.canvas.offsetLeft;
        this.canvasy = this.ctx.canvas.offsetTop;
      };
      })
    }
  }
  
  



