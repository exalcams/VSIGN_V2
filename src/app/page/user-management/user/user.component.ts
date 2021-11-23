import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserWithRole, RoleWithApp, AuthenticationDetails, AppUsageView } from 'src/app/models/master';
// import { SnackBarStatus } from 'src/app/model/notification-snackbar-status-enum';
import { MasterService } from 'src/app/service/master.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  AllUsers: UserWithRole[] = [];
  AllRoles: RoleWithApp[] = [];
  selectedUser: UserWithRole;
  menuItems: string[];
  selectID: any;
  userMainFormGroup: FormGroup;
  searchText: string;
  SelectValue: string;
  isExpanded: boolean;
  AppUsages: AppUsageView[] = [];

  tableDisplayedColumns: string[] = [
    'AppName',
    'UsageCount',
    'LastUsedOn',
  ];
  tableDataSource: MatTableDataSource<AppUsageView>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatSort) tableSort: MatSort;
  constructor(
    private _masterService: MasterService,
    private _formBuilder: FormBuilder,
    private spinner:NgxSpinnerService,private _authService: AuthService
    ) {
    this.selectedUser = new UserWithRole();
    this.searchText = '';
    this.SelectValue = 'All';
  }

  ngOnInit(): void {
    this._authService.isLoggedin(true);
    this.userMainFormGroup = this._formBuilder.group({
      userName: ['', Validators.required],
      roleID: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern]],
      displayName: ['', Validators.required],
      profile: ['']
    });
    this.GetAllRoles();
    this.GetAllUsers();
  }

  ResetControl(): void {
    this.selectedUser = new UserWithRole();
    this.userMainFormGroup.reset();
    Object.keys(this.userMainFormGroup.controls).forEach(key => {
      this.userMainFormGroup.get(key).markAsUntouched();
    });
    this.AppUsages = [];
  }

  GetAllRoles(): void {
    this._masterService.GetAllRoles().subscribe(
      (data) => {
        this.AllRoles = <RoleWithApp[]>data;
        // console.log(this.AllMenuApps);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  GetAllUsers(): void {
    this.spinner.show();
    this._masterService.GetAllUsers().subscribe(
      (data) => {
        this.spinner.hide();
        this.AllUsers = <UserWithRole[]>data;
        if (this.AllUsers && this.AllUsers.length) {
          this.loadSelectedUser(this.AllUsers[0]);
        }
      },
      (err) => {
        console.error(err);
        this.spinner.hide();
      }
    );
  }

  loadSelectedUser(selectedUser: UserWithRole): void {
    this.selectID = selectedUser.UserID;
    this.selectedUser = selectedUser;
    this.SetUserValues();
    // this.GetAppUsagesByUser();
  }

  SetUserValues(): void {
    this.userMainFormGroup.get('userName').patchValue(this.selectedUser.UserName);
    this.userMainFormGroup.get('displayName').patchValue(this.selectedUser.DisplayName);
    this.userMainFormGroup.get('roleID').patchValue(this.selectedUser.RoleID);
    this.userMainFormGroup.get('email').patchValue(this.selectedUser.Email);
    this.userMainFormGroup.get('contactNumber').patchValue(this.selectedUser.ContactNumber);
  }

  GetAppUsagesByUser(): void {
    this.spinner.show();
    this._masterService.GetAppUsagesByUser(this.selectedUser.UserID).subscribe(
      (data) => {
        this.spinner.hide();
        this.AppUsages = data as AppUsageView[];
        this.tableDataSource = new MatTableDataSource(this.AppUsages);
        this.tableDataSource.paginator = this.tablePaginator;
        this.tableDataSource.sort = this.tableSort;
      },
      (err) => {
        console.error(err);
        this.spinner.hide();
      }
    );
  }

  GetUserValues(): void {
    this.selectedUser.UserName = this.userMainFormGroup.get('userName').value;
    this.selectedUser.DisplayName = this.userMainFormGroup.get('displayName').value;
    this.selectedUser.RoleID = this.userMainFormGroup.get('roleID').value;
    this.selectedUser.Email = this.userMainFormGroup.get('email').value;
    this.selectedUser.ContactNumber = this.userMainFormGroup.get('contactNumber').value;
  }

  CreateUser(): void {
    this.GetUserValues();
    this.spinner.show();
    this._masterService.CreateUser(this.selectedUser).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.spinner.hide();
        this.GetAllUsers();
      },
      (err) => {
        console.error(err);
        this.spinner.hide();
      }
    );

  }

  UpdateUser(): void {
    this.GetUserValues();
    this.spinner.show();
    this._masterService.UpdateUser(this.selectedUser).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.spinner.hide();
        this.GetAllUsers();
      },
      (err) => {
        console.error(err);
        this.spinner.hide();
      }
    );
  }

  DeleteUser(): void {
    this.GetUserValues();
    this.spinner.show();
    this._masterService.DeleteUser(this.selectedUser).subscribe(
      (data) => {
        // console.log(data);
        this.ResetControl();
        this.spinner.hide();
        this.GetAllUsers();
      },
      (err) => {
        console.error(err);
        this.spinner.hide();
      }
    );
  }

  ShowValidationErrors(): void {
    Object.keys(this.userMainFormGroup.controls).forEach(key => {
      this.userMainFormGroup.get(key).markAsTouched();
      this.userMainFormGroup.get(key).markAsDirty();
    });

  }

  SaveClicked(): void {
    if (this.userMainFormGroup.valid) {
      if (this.selectedUser.UserID) {
        this.UpdateUser();
      } else {
        this.CreateUser();
      }
    } else {
      this.ShowValidationErrors();
    }
  }

  DeleteClicked(): void {
    if (this.userMainFormGroup.valid) {
      if (this.selectedUser.UserID) {
        this.DeleteUser();
      }
    } else {
      this.ShowValidationErrors();
    }
  }


  // exportAsXLSX(): void {
  //   const currentPageIndex = this.tableDataSource.paginator.pageIndex;
  //   const PageSize = this.tableDataSource.paginator.pageSize;
  //   const startIndex = currentPageIndex * PageSize;
  //   const endIndex = startIndex + PageSize;
  //   const itemsShowed = this.AppUsages.slice(startIndex, endIndex);
  //   const itemsShowedd = [];
  //   itemsShowed.forEach(x => {
  //     const item = {
  //       'User ID': x.UserID,
  //       'User Name': x.UserName,
  //       'User Role': x.UserRole,
  //       'App Name': x.AppName,
  //       'Usages': x.UsageCount,
  //       'Last UsedOn': x.LastUsedOn ? this._datePipe.transform(x.LastUsedOn, 'dd-MM-yyyy') : '',
  //     };
  //     itemsShowedd.push(item);
  //   });
  //   this._excelService.exportAsExcelFile(itemsShowedd, `${this.selectedUser.UserName}AppUsage`);
  // }
  expandClicked(): void {
    this.isExpanded = !this.isExpanded;
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }
}

