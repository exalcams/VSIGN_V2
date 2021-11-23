import { EventEmitter, HostListener, ViewEncapsulation } from '@angular/core';
// import { FormGroup } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { FilenameAndDocIDs } from '../new-doucument/models/FilenamesandAttIDs.model';
// import { DialogComponent } from './pages/digital-signing/dialog.component';
import { ChangeDetectorRef, Component, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { digital } from './signing';
import { SignatureService } from '../digital-signing/signature.service';
// import { MatDialog, MatDialogConfig, MatDialogRef, throwToolbarMixedModesError } from '@angular/material';
import { SigndocumentComponent } from '../digital-signing/signdocument/signdocument.component';
import { GetattachmentdetailsService } from '../new-doucument/getattachmentdetails.service';
import { DocAtt } from './Model/DocAtt.model';
import { DocReturnData } from './Model/returnfile.model';
import { SignandUpdatedocService } from './signandupdatedoc.service';
import { DocumentService } from '../new-doucument/document.service';
import { createdoc } from '../new-doucument/models/createdoc.model';
import { FilenameAndDocIDs } from './Model/FilenamesandAttIDs.model';
import { RetImg } from './Model/retdata.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { docapp } from '../new-doucument/models/docapp.model';
import { docatt } from '../new-doucument/models/docatt.model';
import { SignedAttIDs } from './Model/AttandAtt1.model';
import { ReleaseDocParams } from '../new-doucument/models/releaseparam.model';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'src/app/models/master';
import * as FileSaver from 'file-saver';

// import { d } from '@angular/core/src/render3';
import { DocAttanRemarks } from './Model/DocAttandRemarks.model';
import { OwnerRemarksComponent } from './owner-remarks/owner-remarks.component';
import { PopUpReturnData } from './Model/PopUpReturnData.model';
import { DocAppLog } from './Model/AppLog.model';
import { SignByUserResponse } from './Model/SignByUserResponse.model';
import { GetattachmentdetailsService1 } from './getattachmentdetails.service1';
import { ActionLog } from 'src/app/models/Master';
import { AuthService } from 'src/app/service/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
// import Help from '../digital-signing/help'

declare const GetPdfImages: any;
@Component({
  selector: 'app-digital-signing',
  templateUrl: './digital-signing.component.html',
  styleUrls: ['./digital-signing.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class DigitalSigningComponent implements OnInit {
@HostListener('window:beforeunload',['$onAadharwindowclosed'])
  completed: boolean = true;
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
  base64for_tag:any;
  tag_filename:any;
  TagValues=[];
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
  formdata: FormData = new FormData();
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
  constructor(private spinner: NgxSpinnerService,public dialog: MatDialog, private fb: FormBuilder,private http:HttpClient,
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
 
  onCreate() {

    const dialogconfig = new MatDialogConfig();
    dialogconfig.disableClose = false;
    dialogconfig.autoFocus = true;
    dialogconfig.data = {
      sgnSelf: this.docattandRmrks.signSelf,
      sgnImg: this.docattandRmrks.signImg,
      sgnCert: this.docattandRmrks.signCert,
      sgnToken: this.docattandRmrks.signToken,
      sgnAadhar: this.docattandRmrks.signAadhar,
      sgnCursor: this.docattandRmrks.signCursor,
      sgnTag:this.docattandRmrks.signTag,
      nofselected: this.FileNames.length == this.selectedFilename.length ? "All" : this.selectedFilename.length

    }
    this.CreateActionLogvalues("Sign Document Dialog");
    const data = this.Dialog.open(SigndocumentComponent, dialogconfig);
    data.afterClosed().subscribe(data => {
      this.attachmentaadhar = data;
      // console.log(data);
      this.selectedData = data as PopUpReturnData;
      console.log(this.selectedData);

      if (this.selectedData != null) {
        if (this.selectedData.sgnPages === "all") {
          this.selectedoptionfromdialog = "All"
        }
        else if (this.selectedData.sgnPages === "last") {
          this.selectedoptionfromdialog = this.totalPages + "_";
        }
        else if (this.selectedData.sgnPages === "1_") {
          this.selectedoptionfromdialog = "1_"
        }
        else {
          this.selectedoptionfromdialog = this.selectedData.sgnPages;
        }

        if (this.selectedData.sgnLocation === "Tag") {
          this.selectedoptionfromdialog = "All";
        }
        console.log(this.selectedoptionfromdialog);
        let dp: docapp = new docapp();
        dp.client = this.curruser.ClientID;
        dp.company = this.curruser.Company;;
        this.isProgressBarVisibile = true;
        dp.docId = this.DocID;
        this.attachmentdetails.updateDocApp(dp).subscribe((v: SignByUserResponse) => {
          console.log(v);
          let doclog: DocAppLog = new DocAppLog;
          doclog.client = this.curruser.ClientID;
          doclog.company = this.curruser.Company;
          doclog.date = new Date();
          doclog.signType = this.selectedData.sgnByMeans;
          doclog.commnets = this.selectedData.sgnRemarks;
          doclog.docId = this.DocID;
          doclog.user = this.curruser.DisplayName;
          this.attachmentdetails.createLog(doclog).subscribe(h => {


            if (v.affrimativeflag === "positive") {
              this.SigninganUpdating(v.emailIDs)
            }
            else {
              this.isProgressBarVisibile = false;


              this.router.navigate(["/page/dashboard"])
            }
          })


        })
        // this.selectedoptionfromdialog = "2_3_5";


      }

    })



    // console.log(this.arr);
    // const mapped = Object.keys(data).map(key => ({ type: key, value: data[key] }));
    // console.log(mapped);
    // this.popup1 = data.role;
    // console.log("name",this.username)



  }

  SigninganUpdating(emailIDs: string[]) {
    this.attachmentdetails.getfilefromPostGres(this.AttIDs).subscribe((y: DocReturnData[]) => {

      this.spinner.show();

      console.log("got Att Details");

      this.temp = new FormData();


      console.log(this.selectedData);

      y.forEach(q => {
        this.base64for_tag=q.files;
        this.tag_filename=q.fileName;
        const blob = this.dataURItoBlob(q.files)
        const file = new File([blob], q.fileName, { 'type': q.fileType })
        this.temp.append(file.name, file, file.name);
        this.toSignFiles.push(file);
      })
      if (this.selectedData.sgnByMeans == "Screen") {
        this.temp.append("b64img", this.selectedData.sgnSelfImg);
        this.temp.append("pgno", this.selectedoptionfromdialog);
        this.temp.append("Xcordinate", (50).toString());
        this.temp.append("Ycordinate", (100).toString());
        this.temp.append("tagname", this.selectedData.sgnTagName);
        if (this.selectedData.sgnLocation === "Tag") {
          this.temp.append("configlocation", "Tag")
        }
        else {
          this.temp.append('configlocation', "Page");
        }
        this.GetsignService.SignByImgService(this.temp).subscribe((l: any) => {
          console.log("posted files to postgres", l);

          const attids1: string[] = l;

          let attandatt1: SignedAttIDs = new SignedAttIDs();
          attandatt1.attIds = this.AttIDs;
          attandatt1.attIds1 = attids1;
          this.attachmentdetails.getfilefromPostGres(attids1).subscribe((u: DocReturnData[]) => {
            let emailFiles: File[] = [];
            u.forEach(q => {
              const blob = this.dataURItoBlob(q.files)
              const file = new File([blob], q.fileName, { 'type': q.fileType })
              this.temp.append(file.name, file, file.name);
              emailFiles.push(file);
            })

            this.GetsignService.UpdateAttIds(attandatt1).subscribe(() => {
              console.log("att1 updated");

              let releaseADoc: ReleaseDocParams = new ReleaseDocParams();

              releaseADoc.DocID = this.DocID;
              releaseADoc.Status = "Completed";
              this.GetsignService.releaseDoc(releaseADoc).subscribe(() => {
                this.isProgressBarVisibile = false;
               // this.SendEmail(emailFiles, this.DocID, emailIDs)
                this.spinner.hide();
                this.router.navigate(["/page/dashboard"]);
              })
            })
          })

        })
      }
      else if (this.selectedData.sgnByMeans == "Token") {
        let pdflist: Array<string> = new Array<string>();
        y.forEach(f => {
          pdflist.push(f.files);

        })
        //let strpdflist =  JSON.stringify(pdflist);
        this.signservice.USBSignDocument(pdflist[0]).subscribe((pdf: any) => {
          let signedpfs = pdf.b64 as string[];

          let formdata: FormData = new FormData();
          for (let e = 0; e < this.toSignFiles.length; e++) {
            //let sb64: any = JSON.parse(signedpfs[e]);
            const signedBlob = this.dataURItoBlob(signedpfs);
            const signedFile = new File([signedBlob], this.toSignFiles[e].name, { type: "application/pdf" });
            console.log(this.toSignFiles[e].name);
            formdata.append(signedFile.name, signedFile, signedFile.name);


          }
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
                this.spinner.hide();
                this.router.navigate(["/page/dashboard"]);
              })
            })
          })


        });
      }
      else if(this.selectedData.sgnByMeans == "Tag"){
        console.log("tag signing");
        let signername ="Exalca";
        let Displaytitle1="Exalca";
        let PdfContent =this.base64for_tag.toString();
        let Filename =this.tag_filename.toString();
        // console.log(PdfContent);
        
        this.TagValues=[{signername,Displaytitle1,Filename,PdfContent}]
        // console.log(this.TagValues);
          let json:any = JSON.stringify(this.TagValues[0]);
          // console.log(json);
          this.GetsignService.Tagsigning(json).subscribe((data:any)=> {
            console.log(data,"fetched return data")
           


            const BlobFile = data.body as Blob;
           // FileSaver.saveAs(BlobFile, "Test.pdf");

            // console.log(data,"fetched return data")
            // let signedpfs = data.pdfcontent as string[];
            let signedFile;
             this.formdata= new FormData();
            for (let e = 0; e < this.toSignFiles.length; e++) {
              //let sb64: any = JSON.parse(signedpfs[e]);
              // const signedBlob = this.dataURItoBlob(signedpfs);
              signedFile = new File([BlobFile], this.toSignFiles[e].name, { type: "application/pdf" });
              console.log(this.toSignFiles[e].name);
              this.formdata.append(this.toSignFiles[e].name,signedFile,this.toSignFiles[e].name);
            }
            // const ConvertedBlob = new Blob([data.pdfcontent], {
            //   type: 'application/pdf,'
            // });
            // formdata.append(data.filename, ConvertedBlob, data.filename);


          // }
            this.signservice.postfiletoPostGres(this.formdata).subscribe((l: any) => {
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
                  this.spinner.hide();
                  this.router.navigate(["/page/dashboard"]);
                })
              })
            })
          })
          

      
        
      }
      else if (this.selectedData.sgnByMeans == "Aadhar") {
      
        
        console.log("aa")
       

        this.signservice.AadharSignDocument(this.attachmentaadhar).subscribe((str: any) => {
           let newWindow = window.open("","newWindow","status");
            newWindow.document.write(str);
          newWindow.document.close();

        // let fd: FileDocID = new FileDocID();
        // fd.FDocID = this.AttIDs;
        // fd.sfile = attids1;
        // let attandatt1: SignedAttIDs = new SignedAttIDs();
        // attandatt1.attIds = this.AttIDs;
        // attandatt1.attIds1 = attids1;
        // this.attachmentdetails.getfilefromPostGres(attids1).subscribe((u: DocReturnData[]) => {
        //   let emailFiles: File[] = [];
        //   u.forEach(q => {
        //     const blob = this.dataURItoBlob(q.files)
        //     const file = new File([blob], q.fileName, { 'type': q.fileType })
        //     this.temp.append(file.name, file, file.name);
        //     emailFiles.push(file);
        //   })

        //   this.GetsignService.UpdateAttIds(attandatt1).subscribe(() => {
        //     console.log("att1 updated");

        //     let releaseADoc: ReleaseDocParams = new ReleaseDocParams();

        //     releaseADoc.DocID = this.DocID;
        //     releaseADoc.Status = "Completed";
        //     this.GetsignService.releaseDoc(releaseADoc).subscribe(() => {
        //       this.isProgressBarVisibile = false;
        //       this.SendEmail(emailFiles, this.DocID, emailIDs)
        //       this.router.navigate(["/pages/center"]);
        //     })
        //   })
        // })
      })
      }
      else if (this.selectedData.sgnByMeans == "Cursor") {
       this.router.navigate(["/page/cursor"]);
      }
      else {
        let signername ="Exalca";
        let Displaytitle1="Exalca";
        let PdfContent =this.base64for_tag.toString();
        let Filename =this.tag_filename.toString();
        // console.log(PdfContent);
        
        this.TagValues=[{signername,Displaytitle1,Filename,PdfContent}]
        // console.log(this.TagValues);
          let json:any = JSON.stringify(this.TagValues[0]);
          // console.log(json);
          this.GetsignService.Tagsigning(json).subscribe((data:any)=> {
            console.log(data,"fetched return data")
           


            const BlobFile = data.body as Blob;
            //FileSaver.saveAs(BlobFile, "Test.pdf");

            // console.log(data,"fetched return data")
            // let signedpfs = data.pdfcontent as string[];
            let signedFile;
             this.formdata= new FormData();
            for (let e = 0; e < this.toSignFiles.length; e++) {
              //let sb64: any = JSON.parse(signedpfs[e]);
              // const signedBlob = this.dataURItoBlob(signedpfs);
              signedFile = new File([BlobFile], this.toSignFiles[e].name, { type: "application/pdf" });
              console.log(this.toSignFiles[e].name);
              this.formdata.append(this.toSignFiles[e].name,signedFile,this.toSignFiles[e].name);
            }
            // const ConvertedBlob = new Blob([data.pdfcontent], {
            //   type: 'application/pdf,'
            // });
            // formdata.append(data.filename, ConvertedBlob, data.filename);


          this.GetsignService.postfiletoPostGres(this.formdata).subscribe((l: any) => {
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
                //this.SendEmail(emailFiles, this.DocID, emailIDs);
                this.spinner.hide();
                this.router.navigate(["/page/dashboard"]);
              })
            })
          })
        })
      }


    })
    this.spinner.hide();
  }

  CreateActionLogvalues(text): void {
    this.ActionLog = new ActionLog();
    this.ActionLog.UserID = this.curruser.UserID;
    this.ActionLog.AppName = "Signing Document";
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
    this._authservice.isLoggedin(true);
    // this.GetPdfImages();
    // this.spinner.show();
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
      // this.spinner.show();
      this.clientID = client
      this.attachmentdetails.getAttachmentDetails(client, company, docId).subscribe(
        (data) => {
          console.log(data);
          this.spinner.show();
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
            this.attachmentdetails.getAttachmentPosgresql(this.FileNames[0].docID).subscribe((x: DocReturnData) => {
              console.log(x,"FIles")
              const blob =new Blob([this.dataURItoBlob1(x.files)], {
                type: "application/pdf"});
              //  this.dataURItoBlob1(x.files);
               const fileURL =URL.createObjectURL(blob);
               this.imgSrc = fileURL;
              //  this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
              console.log(this.imgSrc,"PDFIMAGe")
              const dfile = new File([blob], x.fileName, { type: x.fileType });
              this.spinner.hide();
              // const dblob = this.dataURItoBlob(x.files);
              // const fileURL = URL.createObjectURL(dblob);
              // this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
              // console.log(this.imgSrc,"PDFIMAGe")
              // const dfile = new File([dblob], x.fileName, { type: x.fileType });
              // FileSaver.saveAs(dfile);
            })
          })

        }
      )
      
    }
    else {
      // this.spinner.show();
      this.clientID = com_client;
      this.attachmentdetails.getAttachmentDetails(com_client, com_company, com_docId).subscribe(
        (data) => {
           this.spinner.show();
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
            this.attachmentdetails.getAttachmentPosgresql(this.FileNames[0].docID).subscribe((x: DocReturnData) => {
              console.log(x,"FIles")
              let fileType =x.fileName.toLowerCase().includes('.pdf') ? 'application/pdf' : '';
              const blob =new Blob([this.dataURItoBlob1(x.files)], {
                type: "application/pdf"});
              //  this.dataURItoBlob1(x.files);
               const fileURL =URL.createObjectURL(blob);
               this.imgSrc = fileURL;
              //  this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
              console.log(this.imgSrc,"PDFIMAGe")
              const dfile = new File([blob], x.fileName, { type: x.fileType });
              this.spinner.hide();
              // FileSaver.saveAs(dfile);
            })
          })
        }
      )
      this.spinner.hide();
    }
    this.spinner.hide();
  }
  dataURItoBlob1(base64){
    const binary_string = window.atob(base64);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        
        return bytes.buffer;
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
  Router(){
    this.router.navigate(["/page/dashboard"]);
  }
  onClickDownload(i: number) {
    this.attachmentdetails.getAttachmentPosgresql(this.FileNames[i].docID).subscribe((x: DocReturnData) => {
      console.log(x,"base64");
      const dblob = this.dataURItoBlob(x.files);
      const dfile = new File([dblob], x.fileName, { type: x.fileType });
      FileSaver.saveAs(dfile);
    })

  }
  onClickFileName(fn: number) {
    this.dynamicimgs = [];
    this.presentFilnamr = this.FileNames[fn]
    this.DisplayDocName = this.presentFilnamr.fname;
    console.log(fn);
    this.thumbnail = [];
    this.hidespin = true;
    if (localStorage.getItem(this.presentFilnamr.docID + "_pdf") === null) {
      this.attachmentdetails.getAttachmentPosgresql(this.presentFilnamr.docID).subscribe((w: DocReturnData) => {
        const flblob = this.dataURItoBlob(w.files);
        let pdf_fileurl = URL.createObjectURL(flblob);
this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(pdf_fileurl);
        localStorage.setItem(this.presentFilnamr.docID + "_pdf", pdf_fileurl);
        GetPdfImages(pdf_fileurl).then((x) => {
          // console.log(x);
          this.thumbnail.push(...x);


        });
      })
    }
    else {
      GetPdfImages(localStorage.getItem(this.presentFilnamr.docID + "_pdf")).then((x) => {
        // console.log(x);
        this.thumbnail.push(...x);


      });
    }
    if (localStorage.getItem(this.presentFilnamr.docID + "img_" + 1) === null) {
      this.attachmentdetails.getPdfImg(this.presentFilnamr.docID, (1).toString()).subscribe((b) => {
        let firstimg: RetImg = b as RetImg;
        localStorage.setItem(this.presentFilnamr.docID + "img_" + 1, firstimg.b64string);
        const imgblob = this.dataURItoBlob(firstimg.b64string);
        let furl = URL.createObjectURL(imgblob);
        this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(furl);
        this.hidespin = false
      })
    }
    else {
      const imgblob = this.dataURItoBlob(localStorage.getItem(this.presentFilnamr.docID + "img_" + 1));
      let furl = URL.createObjectURL(imgblob);
      this.imgSrc = this.sanitizer.bypassSecurityTrustResourceUrl(furl);
      this.hidespin = false;
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
//   ngOnDestroy() {
//     alert(`I'm leaving the app!`);
// }
zoomin(){
  var myImg = document.getElementById("image_pdf");
  var currWidth = myImg.clientWidth;
  if(currWidth == 25000) return false;
   else{
      myImg.style.maxWidth = (currWidth + 100) + "px";
  } 
}
zoomout(){
  var myImg = document.getElementById("image_pdf");
  var currWidth = myImg.clientWidth;
  if(currWidth == 100) return false;
else{
      myImg.style.maxWidth = (currWidth - 100) + "px";
  }
}
}

function unloadHandler(onAadharwindowclosed: () => void) {
  throw new Error('Function not implemented.');
}

function beforenuloadHandler(_onAadharwindowclosed: () => void) {
  throw new Error('Function not implemented.');
}

