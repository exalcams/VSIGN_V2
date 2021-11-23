import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
// import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

// import { DialogData } from 'src/app/models/invoice-item.model';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})

export class ConfirmationDialogComponent implements OnInit {
  confirmationflag = 'yes';
  public imgWarUrl:string="";

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    public dialog: MatDialog,
    
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.imgWarUrl=window.location.origin +"/assets/images/warning.png";
  }

    onNoClick(): void {
      this.dialogRef.close();
    }
  }
