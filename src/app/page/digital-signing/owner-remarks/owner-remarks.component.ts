import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-owner-remarks',
  templateUrl: './owner-remarks.component.html',
  styleUrls: ['./owner-remarks.component.scss']
})
export class OwnerRemarksComponent implements OnInit {
   remarks:string ;
   givenby:string;
  constructor(public dialogRef: MatDialogRef<OwnerRemarksComponent>,@Inject(MAT_DIALOG_DATA) data) { 
    this.remarks = data.remarks;
    this.givenby = data.givenby;
  }

  ngOnInit() {
  }
  dialogRefclose(){
    this.dialogRef.close();
  }
}
