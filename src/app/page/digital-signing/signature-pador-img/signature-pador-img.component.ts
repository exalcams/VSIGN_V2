import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SignaturePad } from 'angular2-signaturepad';
// import { SignaturePad } from 'angular2-signaturepad';
@Component({
  selector: 'app-signature-pador-img',
  templateUrl: './signature-pador-img.component.html',
  styleUrls: ['./signature-pador-img.component.scss']
})
export class SignaturePadorImgComponent implements OnInit {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  url: string;
  files:File;
  fname:string="";
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 150
  };
  constructor(public dialogRef: MatDialogRef<SignaturePadorImgComponent>) { }
  fileChange(event){
    if (event.target.value) {
     this.files=event.target.files[0];
     this.fname= this.files.name;
     this.drawclear()
      this.changeFile(this.files).then((urldata: string): any => {
       this.url=urldata;});
    
    }
  }
  changeFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
  });
}
drawComplete() {
  var base64=this.signaturePad.toDataURL();
  this.url=base64;
  this.fname ="";
}

drawclear(){
this.signaturePad.clear();
}

  ngOnInit() {
  }
onclickSubmit(){
  let BASE64_MARKER = ';base64,';
  var base64Index =this.url.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = this.url.substring(base64Index);
  console.log(base64);
  
   this.dialogRef.close(base64);


}
onclickCancel(){
  this.dialogRef.close(null);
}
dialogRefclose(){
  this.dialogRef.close();
}
}
