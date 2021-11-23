// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-attachmentview',
  templateUrl: './attachmentview.component.html',
  styleUrls: ['./attachmentview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AttachmentviewComponent implements OnInit {
  public AttachmentData: any;
  constructor(
    public matDialogRef: MatDialogRef<AttachmentviewComponent>,
    @Inject(MAT_DIALOG_DATA) public attachmentDetails: any,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const fileURL = URL.createObjectURL(this.attachmentDetails.blob);
    this.AttachmentData = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    console.log(this.AttachmentData)
  }

  CloseClicked(): void {
    this.matDialogRef.close(null);
  }
  

}
