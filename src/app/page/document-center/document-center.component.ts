import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { MatPaginator ,MatDialog} from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
// import { TagDetails } from 'src/app/models/Dashboard';
import { AuthenticationDetails } from 'src/app/models/master';
import { NotificationSnackBarComponent } from 'src/app/notifications/notification-snack-bar/notification-snack-bar.component';
// import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';
import { DatePipe } from '@angular/common'

// import {
//   ApexNonAxisChartSeries,
//   ApexResponsive,
//   ApexChart,
//   ApexPlotOptions,
//   ApexDataLabels,
// } from "ng-apexcharts";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexResponsive,
  ApexLegend,
  ApexYAxis
} from "ng-apexcharts";
import { forkJoin, Observable } from 'rxjs';
// import { DashboardService1 } from '../../dashboard1.service';
import { DocHeaderDetail } from './models/DashboardTable.model';
import { efficiencyChart } from './models/efficiencyChart.model';
import { processChart } from './models/processChart.model';
import { emailsender } from './models/RemainderEmail.model';
import { sendRemainder } from './models/SendRemainder.model';
import { ActionLog } from 'src/app/models/master';
import { AuthService } from 'src/app/service/auth.service';
import { HttpParams } from '@angular/common/http';
// import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { DocReturnData } from '../repository/models/returndataPostgres.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
// import { element } from '@angular/core/src/render3/instructions';
import { reduce } from 'lodash';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { TagDetails } from './document-center';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DashboardService1 } from '../repository/service/dashboard1.service';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  responsive: ApexResponsive[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
};
export interface PeriodicElement {
  title: string;
  author: string;
  date: string;
  fulfilment: string;
  signed: string;
  completed: string;
  action: string;
}



@Component({
  selector: 'app-document-center',
  templateUrl: './document-center.component.html',
  styleUrls: ['./document-center.component.scss'],

})
export class DocumentCenterComponent implements OnInit {
  snackbar: NotificationSnackBarComponent;
  formdata: FormData;
  hidespin1: boolean;
  InitiatedRecords: DocHeaderDetail[] = [];
  NxtSignRecords: DocHeaderDetail[] = [];
  SignedRecords: DocHeaderDetail[] = [];
  _localvariable: TagDetails;
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  // data1: CloudData[]=[];
  AllRecords = [];
  signlength = [];
  completedby: any = [];
  signlength1: any = 0;
  viewClient: string = "";
  viewCompany: string = "";
  viewDocId: string = "";
  signcompletelength = [];
  signcompletelength1: any = 0;
  signcompletelength2 = [];
  signcompletelength3: any = 0;
  ActionLog: any;
  data_arr = [];
  Create: any;
  DocList = [];
  displayname: string = "";
  curruser: AuthenticationDetails;
  links = ['All', 'Create', 'Released', 'In Signing', 'Completed'];
  activeLink = this.links[0];
  efficiencyChartData: efficiencyChart;
  effi_percentage: number;
  processChartData: processChart = new processChart();
  signing_process: number;
  Signing_process: number;
  hidespin: boolean;
  color = 'primary';
  modespin = 'indeterminate';
  latest_date = [];
  latest_date1 = [];
  latest_date2 = [];
  latest_date3 = [];
  count_jan = 0;
  count_feb = 0;
  count_mar = 0;
  count_apr = 0;
  count_may = 0;
  count_jun = 0;
  count_jul = 0;
  count_aug = 0;
  count_sep = 0;
  count_oct = 0;
  count_nov = 0;
  count_dec = 0;
  count_jan1 = 0;
  count_feb1 = 0;
  count_mar1 = 0;
  count_apr1 = 0;
  count_may1 = 0;
  count_jun1 = 0;
  count_jul1 = 0;
  count_aug1 = 0;
  count_sep1 = 0;
  count_oct1 = 0;
  count_nov1 = 0;
  count_dec1 = 0;
  count_jan2 = 0;
  count_feb2 = 0;
  count_mar2 = 0;
  count_apr2 = 0;
  count_may2 = 0;
  count_jun2 = 0;
  count_jul2 = 0;
  count_aug2 = 0;
  count_sep2 = 0;
  count_oct2 = 0;
  count_nov2 = 0;
  count_dec2 = 0;
  count_jan3 = 0;
  count_feb3 = 0;
  count_mar3 = 0;
  count_apr3 = 0;
  count_may3 = 0;
  count_jun3 = 0;
  count_jul3 = 0;
  count_aug3 = 0;
  count_sep3 = 0;
  count_oct3 = 0;
  count_nov3 = 0;
  count_dec3 = 0;
  countdelay = 0;
  form: FormGroup;
  currentDate = new Date();


  employeesDataSource: MatTableDataSource<any>;
  employeesDisplayColumns: string[] = ['title', 'author', 'date', 'fulfilment', 'approver', 'signed', 'completeby', 'remainder', 'action', 'status'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //  @ViewChild(MatPaginator) paginator: MatPaginator;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  public chartOptions: ChartOptions;
  date: Date;
  selecteddocId: any;
  isDateError: boolean;
  DocList1 = [];
  filterdata: any[];

  constructor(private service: DashboardService1, private spinner: NgxSpinnerService, private dialog: MatDialog, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder, public datepipe: DatePipe, private _authservice: AuthService) {
    this.curruser = JSON.parse(localStorage.getItem("authorizationData"));
    localStorage.setItem("displayName", this.curruser.DisplayName);
    console.log('newnamecursor', localStorage.getItem("displayName"));
    this.displayname = this.curruser.DisplayName;
    // this.displayname = localStorage.getItem("displayName");
    console.log('newname', this.displayname);
    this.form = this.fb.group({
      fromdate: [''],
      todate: ['']
    });


  }

  ngOnInit(): void {
    this._authservice.isLoggedin(true);
    const currentDate = new Date();
    console.log(currentDate)
    //alert("date : "+ dateParts[0]+ dateParts[1] + " Year : " + dateParts[2]);
    this.hidespin = true;
    this.links = ['All', 'Create', 'Released', 'In Signing', 'Completed'];
    this.dashboardGraph();
    this.chartOptions1();
    this.getAllDashBoardData();
  }
  dashboardGraph() {
    this.spinner.show();
    this.getAllDashBoardData().subscribe((x: any) => {
      this.InitiatedRecords = x[0];
      this.NxtSignRecords = x[1];
      this.SignedRecords = x[2];
      const tableRecords = [];
      var tagdata = {
        text: "",
        weight: 0
      }

      // for(var i=0;i< this.SignedRecords.length;i++){
      //   this.data1.push( {text:this.SignedRecords[i].title,
      //  weight:parseInt(this.SignedRecords[i].scount)})
      // }
      // console.log(this.data1);
      this.NxtSignRecords.forEach(g => {
        if (this.InitiatedRecords.indexOf(this.InitiatedRecords.find(k => k.docId == g.docId)) < 0) {
          tableRecords.push(g)
        }
      })

      this.SignedRecords.forEach(g => {
        if (this.InitiatedRecords.indexOf(this.InitiatedRecords.find(k => k.docId == g.docId)) < 0) {
          tableRecords.push(g)
        }
      })
      this.InitiatedRecords.forEach(g => {
        if (tableRecords.indexOf(g) < 0) {
          tableRecords.push(g);
        }
      })
      console.log(tableRecords);


      this.AllRecords = tableRecords.reverse();
      this.hidespin = false;
      this.filterdata = this.AllRecords;
      this.employeesDataSource = new MatTableDataSource(this.AllRecords);
      this.DocList = tableRecords;
      console.log(this.AllRecords);
      // localStorage.setItem("Tablevalue",JSON. stringify(this.DocList));

      //  this.count_jan =0 ;2021-07-30T10:32:34.35
      //console.log(this.datepipe.transform('2021-07-30T10:32:34.35', 'MMM dd yyyy hh mm ss'), "july month");

      for (let i = 0; i < this.DocList.length; i++) {
        // console.log(this.DocList[i].fulfilment);

        if (this.DocList[i].fulfilment == "Draft") {
          this.latest_date.push(this.datepipe.transform(this.DocList[i].createdOn, 'MMM'));

        }
        else if (this.DocList[i].fulfilment == "Released") {
          this.latest_date1.push(this.datepipe.transform(this.DocList[i].createdOn, 'MMM'));

        }
        else if (this.DocList[i].fulfilment == "In Signing") {
          this.latest_date2.push(this.datepipe.transform(this.DocList[i].createdOn, 'MMM'));
        }
        else if (this.DocList[i].fulfilment == "Completed") {
          this.latest_date3.push(this.datepipe.transform(this.DocList[i].createdOn, 'MMM'));
        }

      }
      //Draft
      for (let k = 0; k < this.latest_date.length; k++) {
        if (this.latest_date[k] === "Jan") {
          this.count_jan = this.count_jan + 1;
          // console.log(this.count_jan, "jan month count");
        }
        else if (this.latest_date[k] === "Feb") {
          this.count_feb = this.count_feb + 1;
          // console.log(this.count_jan, "feb month count");
        }
        else if (this.latest_date[k] === "Mar") {
          this.count_mar = this.count_mar + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date[k] === "Apr") {
          this.count_apr = this.count_apr + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date[k] === "May") {
          this.count_may = this.count_may + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date[k] === "Jun") {
          this.count_jun = this.count_jun + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date[k] === "Jul") {
          this.count_jul = this.count_jul + 1;
          // console.log(this.count_jan, "jul month count");
        }
        else if (this.latest_date[k] === "Aug") {
          this.count_aug = this.count_aug + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date[k] === "Sep") {
          this.count_sep = this.count_sep + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date[k] === "Oct") {
          this.count_oct = this.count_oct + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date[k] === "Nov") {
          this.count_nov = this.count_nov + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date[k] === "Dec") {
          this.count_dec = this.count_dec + 1;
          // console.log(this.count_jan, "jul month count");
        }
      }
      //Released
      for (let k = 0; k < this.latest_date1.length; k++) {
        if (this.latest_date1[k] === "Jan") {
          this.count_jan1 = this.count_jan1 + 1;
          // console.log(this.count_jan, "jan month count");
        }
        else if (this.latest_date1[k] === "Feb") {
          this.count_feb1 = this.count_feb1 + 1;
          // console.log(this.count_jan, "feb month count");
        }
        else if (this.latest_date1[k] === "Mar") {
          this.count_mar1 = this.count_mar1 + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date1[k] === "Apr") {
          this.count_apr1 = this.count_apr1 + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date1[k] === "May") {
          this.count_may1 = this.count_may1 + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date1[k] === "Jun") {
          this.count_jun1 = this.count_jun1 + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date1[k] === "Jul") {
          this.count_jul1 = this.count_jul1 + 1;
          // console.log(this.count_jan, "jul month count");
        }
        else if (this.latest_date1[k] === "Aug") {
          this.count_aug1 = this.count_aug1 + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date1[k] === "Sep") {
          this.count_sep1 = this.count_sep1 + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date1[k] === "Oct") {
          this.count_oct1 = this.count_oct1 + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date1[k] === "Nov") {
          this.count_nov1 = this.count_nov1 + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date1[k] === "Dec") {
          this.count_dec1 = this.count_dec1 + 1;
          // console.log(this.count_jan, "jul month count");
        }
      }
      //In Signing
      for (let k = 0; k < this.latest_date2.length; k++) {
        if (this.latest_date2[k] === "Jan") {
          this.count_jan1 = this.count_jan2 + 1;
          // console.log(this.count_jan, "jan month count");
        }
        else if (this.latest_date2[k] === "Feb") {
          this.count_feb1 = this.count_feb2 + 1;
          // console.log(this.count_jan, "feb month count");
        }
        else if (this.latest_date2[k] === "Mar") {
          this.count_mar2 = this.count_mar2 + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date2[k] === "Apr") {
          this.count_apr2 = this.count_apr2 + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date2[k] === "May") {
          this.count_may2 = this.count_may2 + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date2[k] === "Jun") {
          this.count_jun2 = this.count_jun2 + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date2[k] === "Jul") {
          this.count_jul2 = this.count_jul2 + 1;
          // console.log(this.count_jan, "jul month count");
        }
        else if (this.latest_date2[k] === "Aug") {
          this.count_aug2 = this.count_aug2 + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date2[k] === "Sep") {
          this.count_sep2 = this.count_sep2 + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date2[k] === "Oct") {
          this.count_oct2 = this.count_oct2 + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date2[k] === "Nov") {
          this.count_nov2 = this.count_nov2 + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date2[k] === "Dec") {
          this.count_dec2 = this.count_dec2 + 1;
          // console.log(this.count_jan, "jul month count");
        }
      }
      //Completed
      for (let k = 0; k < this.latest_date3.length; k++) {
        if (this.latest_date3[k] === "Jan") {
          this.count_jan3 = this.count_jan3 + 1;
          // console.log(this.count_jan, "jan month count");
        }
        else if (this.latest_date3[k] === "Feb") {
          this.count_feb3 = this.count_feb3 + 1;
          // console.log(this.count_jan, "feb month count");
        }
        else if (this.latest_date3[k] === "Mar") {
          this.count_mar3 = this.count_mar3 + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date3[k] === "Apr") {
          this.count_apr3 = this.count_apr3 + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date3[k] === "May") {
          this.count_may3 = this.count_may3 + 1;
          // console.log(this.count_jan, "may month count");
        }
        else if (this.latest_date3[k] === "Jun") {
          this.count_jun3 = this.count_jun3 + 1;
          // console.log(this.count_jan, "jun month count");
        }
        else if (this.latest_date3[k] === "Jul") {
          this.count_jul3 = this.count_jul3 + 1;
          // console.log(this.count_jan, "jul month count");
        }
        else if (this.latest_date3[k] === "Aug") {
          this.count_aug3 = this.count_aug3 + 1;
          // console.log(this.count_jan, "mar month count");
        }
        else if (this.latest_date3[k] === "Sep") {
          this.count_sep3 = this.count_sep3 + 1;
          // console.log(this.count_jan, "april month count");
        }
        else if (this.latest_date3[k] === "Oct") {
          this.count_oct3 = this.count_oct3 + 1;
           console.log(this.count_oct3, "may month count");
        }
        else if (this.latest_date3[k] === "Nov") {
          this.count_nov3 = this.count_nov3 + 1;
           console.log(this.count_nov3, "jun month count");
        }
        else if (this.latest_date3[k] === "Dec") {
          this.count_dec3 = this.count_dec3 + 1;
          // console.log(this.count_jan, "jul month count");
        }
      }
      this.signlength = this.DocList.filter(x => { return x.fulfilment == "Released" });
      this.signlength1 = this.signlength.length;
      this.signcompletelength = this.DocList.filter(x => { return x.fulfilment == "Completed" });
      this.signcompletelength1 = this.signcompletelength.length;
      this.signcompletelength2 = this.DocList.filter(x => { return x.fulfilment == "Signing" });
      this.signcompletelength3 = this.signcompletelength2.length;
      this.date = new Date();
      let latest_date = this.datepipe.transform(this.date, 'MMM dd,yyy');
      // console.log(latest_date);

      for (let ik = 0; ik < this.DocList.length; ik++) {
        console.log(this.DocList[ik].completeby);
        this.completedby.push(this.datepipe.transform(this.DocList[ik].completeby, 'MMM dd,yyy'));
        // console.log(this.completedby);
      }

      //         if(this.DocList[ik].completeby>=latest_date){
      // console.log(new Date('MMM dd yyyy'));
      //         }
      for (let ij = 0; ij < this.completedby.length; ij++) {
        if (latest_date >= this.completedby[ij]) {
          this.countdelay = this.countdelay + 1;
        }
      }
      // console.log(this.countdelay);


      // if(this.DocList.)
      this.chartOptions1();

      this.spinner.hide();
      this.employeesDataSource.sort = this.sort
      this.employeesDataSource.paginator = this.paginator;
    })
  }
  chartOptions1() {
    this.chartOptions = {
      series: [
        {
          name: "Created",
          data: [this.count_jan, this.count_feb, this.count_mar, this.count_apr, this.count_may, this.count_jun, this.count_jul,this.count_aug,this.count_sep,this.count_oct,this.count_nov,this.count_dec]
        },
        {
          name: "Released",
          data: [this.count_jan1, this.count_feb1, this.count_mar1, this.count_apr1, this.count_may1, this.count_jun1, this.count_jul1,this.count_aug1,this.count_sep1,this.count_oct1,this.count_nov1,this.count_dec1]
        },
        {
          name: "In Signing",
          data: [this.count_jan2, this.count_feb2, this.count_mar2, this.count_apr2, this.count_may2, this.count_jun2, this.count_jul2,this.count_aug2,this.count_sep2,this.count_oct2,this.count_nov2,this.count_dec2]
        },
        {
          name: "Completed",
          data: [this.count_jan3, this.count_feb3, this.count_mar3, this.count_apr3, this.count_may3, this.count_jun3, this.count_jul3,this.count_aug3,this.count_sep3,this.count_oct3,this.count_nov3,this.count_dec3]
        }
      ],
      chart: {
        height: 150,
        type: "area",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },

      },

      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      stroke: {
        curve: "smooth",
        width: [1, 1, 1, 1],
      },
      yaxis: {
        floating: false,
        decimalsInFloat: undefined,
        labels: {

          style: {
            colors: "#030303",
            fontSize: '10px',
            fontFamily: 'poppins-semi',
            fontWeight: 500,
          }
        },
      },
      xaxis: {
        // type: "datetime",

        categories: [
          // "",
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        labels: {
          style: {
            colors: [],
            // fontSize: '12px',
            fontFamily: 'poppins-semi',
            fontWeight: 500,
            // cssClass: 'apexcharts-xaxis-label',
          },
        },
      },
      // yaxis:{
      //   labels: {
      //     style: {
      //       colors: [],
      //       // fontSize: '12px',
      //       fontFamily: 'poppins-semi',
      //       fontWeight: 500,
      //       // cssClass: 'apexcharts-xaxis-label',
      //     },
      //   },
      // },
      tooltip: {
        // x: {
        //   format: "dd/MM/yy HH:mm"
        // }
      }, responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {

              width: 200,
              redrawOnWindowResize: true
            },

            legend: {
              show: false,
              position: "left",


            }
          }
        },
        {
          breakpoint: 769,
          options: {
            chart: {
              width: 135,
              redrawOnWindowResize: true,
              offsetX: -5
            },

            legend: {
              show: false

            }
          }
        },
        {
          breakpoint: 1025,
          options: {
            chart: {
              width: 140,
              height: 130,
              redrawOnWindowResize: true
            },

            legend: {
              show: false

            }
          }
        }
      ]
    };
  }
  boolNxtsign(g: any) {
    // var a=this.NxtSignRecords;
    // console.log(a);
    if (g.client == this.curruser.ClientID) {
      if (this.NxtSignRecords.indexOf(this.NxtSignRecords.find(k => k.docId == g.docId)) >= 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }

  }
  getAllDashBoardData(): Observable<any> {
    return forkJoin([this.service.getInitiatedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getNxtSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getKPI(this.curruser.ClientID, this.curruser.Company), this.service.getProgress(this.curruser.ClientID, this.curruser.Company)]);
  }
  DateSelected(): void {
    const FROMDATEVAL = this.form.get('fromDate').value as Date;
    const TODATEVAL = this.form.get('toDate').value as Date;
    if (FROMDATEVAL && TODATEVAL && FROMDATEVAL > TODATEVAL) {
      this.isDateError = true;
    } else {
      this.isDateError = false;
    }
  }
  SearchClicked(): void {
    if (this.form.valid) {
      if (!this.isDateError) {
        // this.IsProgressBarVisibile = true;
        // const UserName = this.form.get('UserName').value;
        const FrDate = this.form.get('fromdate').value;
        let FromDate = '';
        if (FrDate) {
          FromDate = this.datepipe.transform(FrDate, 'yyyy-MM-dd');
        }
        const TDate = this.form.get('todate').value;
        let ToDate = '';
        if (TDate) {
          ToDate = this.datepipe.transform(TDate, 'yyyy-MM-dd');
        }
        if (this.curruser.UserRole === 'User' || this.curruser.UserRole === 'TempUser') {
          this.service.FilterTableData(this.curruser.UserName, FromDate, ToDate, this.curruser.ClientID, this.curruser.Company, this.filterdata)
            .subscribe((data: any[]) => {
              console.log(data);
              this.DocList = data;
              console.log(this.DocList)
              this.employeesDataSource = new MatTableDataSource(this.DocList);
              // this.AllUserLoginHistories = data as UserLoginHistory[];
              // this.tableDataSource = new MatTableDataSource(this.AllUserLoginHistories);
              // this.tableDataSource.paginator = this.LoginHistoryPaginator;
              // this.tableDataSource.sort = this.LoginHistorySort;
              // this.IsProgressBarVisibile = false;
            }, (error) => {
              console.error(error);
              // this.IsProgressBarVisibile = false;
            }
            );
        } else {
          // this.service.FilterLoginHistoryByUser( FromDate, ToDate)
          //   .subscribe((data) => {
          //     console.log(data);
          //     // this.AllUserLoginHistories = data as UserLoginHistory[];
          //     // this.tableDataSource = new MatTableDataSource(this.AllUserLoginHistories);
          //     // this.tableDataSource.paginator = this.LoginHistoryPaginator;
          //     // this.tableDataSource.sort = this.LoginHistorySort;
          //     // this.IsProgressBarVisibile = false;
          //   }, (error) => {
          //     console.error(error);
          //     // this.IsProgressBarVisibile = false;
          //   }
          //   );
        }

      }
    } else {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched();
        this.form.get(key).markAsDirty();
      });
    }
  }
  ActiveLink(link: any) {
    if (link === 'Released') {
      this.activeLink = link;
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Released" }));

    }
    if (link === 'In Signing') {
      this.activeLink = link;
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Signing" }))
    }
    if (link === 'Completed') {
      this.activeLink = link;
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Completed" }))
    }
    if (link === 'All') {
      this.activeLink = link;
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Released" || x.fulfilment == "Draft" || x.fulfilment == "In Signing" || x.fulfilment == "Completed" }))
    }
    if (link === 'Create') {
      this.activeLink = link;
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => { return x.fulfilment == "Draft" }))
    }
  }
  sign(client, company, docId, fulfilment, author, createdon, completeby) {
    this.CreateActionLogvalues("Signing DocumentCenter Attachment");
    // client = x[0][0].client;
    // company = x[0][0].company;
    // docId = x[0][0].docId;
    console.log(client);
    localStorage.setItem("displayName", this.curruser.DisplayName);
    this.DocList.forEach(element => {
      if (element.docId === docId) {
        localStorage.setItem("DueDate", element.date);
      }
    })
    if (this.NxtSignRecords.find(f => f.docId == docId) != null) {
      localStorage.setItem("hideSign", "No")
    }

    localStorage.setItem("Author", author)
    localStorage.setItem("fulfilment", fulfilment);
    localStorage.setItem("CreatedOn", createdon);
    localStorage.removeItem('completeclient');
    localStorage.removeItem('completecompany');
    localStorage.removeItem('completedocId');
    localStorage.setItem("completedby", completeby)
    localStorage.setItem("Selectedclient", client);
    localStorage.setItem("Selectedcompany", company);
    localStorage.setItem("SelecteddocId", docId);
    this.router.navigate(['/page/sign']);
  }

  view(client, company, docId, fulfilment) {
    this.CreateActionLogvalues("View DocumentCenter Attachment");

    // client = x[0][0].client;
    // company = x[0][0].company;
    // docId = x[0][0].docId;
    console.log(client);
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    // this.router.navigate(['signDoc']);

    localStorage.setItem("viewClient", client);
    localStorage.setItem("fulfilmentSave", fulfilment)
    localStorage.setItem("viewCompany", company);
    localStorage.setItem("viewDocId", docId);
    localStorage.setItem("forUpdating", "Yes")
    this.router.navigate(['/page/document']);

  }

  applyfilter(filterValue: string): void {
    this.employeesDataSource.filter = filterValue.trim().toLowerCase();
  }
  ondate() {
    if (this.form.get("fromdate").value != null || this.form.get("fromdate").value != "") {
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => {


        console.log(true);
        console.log(new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("fromdate").value, "yyyy-MM-dd"))));
        return new Date(x.date) >= new Date((this.datepipe.transform(this.form.get("fromdate").value, "yyyy-MM-dd")))
      }))
    }
    if (this.form.get("todate").value != null || this.form.get("todate").value != "") {
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => {

       // console.log(new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("todate").value, "yyyy-MM-dd"))));

        return new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("todate").value, "yyyy-MM-dd")))
      }))
    }

    if ((this.form.get("todate").value != null || this.form.get("todate").value != "") && (this.form.get("fromdate").value != null || this.form.get("fromdate").value != "")) {
      this.employeesDataSource = new MatTableDataSource(this.DocList.filter(x => {


        console.log(new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("todate").value, "yyyy-MM-dd"))) && new Date(x.date) >= new Date((this.datepipe.transform(this.form.get("fromdate").value, "yyyy-MM-dd"))));
        return (new Date(x.date) <= new Date((this.datepipe.transform(this.form.get("todate").value, "yyyy-MM-dd"))) && new Date(x.date) >= new Date((this.datepipe.transform(this.form.get("fromdate").value, "yyyy-MM-dd"))))
      }))
    }
  }
  // tslint:disable-next-line:typedef
  addbutton() {
    this.CreateActionLogvalues("Creation");
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    localStorage.removeItem("viewClient");
    localStorage.removeItem("fulfilmentSave")
    localStorage.removeItem("viewCompany");
    localStorage.removeItem("viewDocId");
    this.router.navigate(['/page/document']);
  }
  CreateActionLogvalues(text): void {
    this.ActionLog = new ActionLog();
    this.ActionLog.UserID = this.curruser.UserID;
    this.ActionLog.AppName = "Dashboard";
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

  viewDoc(client, company, docId, fulfilment, author, createdon, completeby) {
    this.CreateActionLogvalues("View DocumentCenter Attachment");
    localStorage.setItem("displayName", this.curruser.DisplayName);
    console.log(fulfilment);
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    let hideSignbutton = "";
    if (this.SignedRecords.find(f => f.docId == docId) != null) {
      localStorage.setItem("hideSign", "Yes")
    }
    if (this.InitiatedRecords.find(f => f.docId == docId) != null) {
      console.log("hidesss");

      localStorage.setItem("hideSign", "Yes")
    }
    this.DocList.forEach(element => {
      if (element.docId === docId) {
        localStorage.setItem("DueDate", element.date);
      }
    });
    localStorage.setItem("fulfilment", fulfilment);
    localStorage.setItem("Author", author)
    localStorage.setItem("CreatedOn", createdon)
    if (fulfilment !== "Completed") {
      console.log("here");


      localStorage.setItem("Selectedclient", client);
      localStorage.setItem("Selectedcompany", company);
      localStorage.setItem("SelecteddocId", docId);
    } else {

      localStorage.setItem("completedby", completeby)
      localStorage.setItem("completeclient", client);
      localStorage.setItem("completecompany", company);
      localStorage.setItem("completedocId", docId);
    }

    this.router.navigate(['/page/sign']);
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
  sendRemainder(client, company, docId, fulfilment, author, createdon, completeby) {
    this.hidespin1 = true;
    this.selecteddocId = docId;
    localStorage.removeItem("Selectedclient");
    localStorage.removeItem("Selectedcompany");
    localStorage.removeItem("SelecteddocId");
    localStorage.removeItem("completeclient");
    localStorage.removeItem("completecompany");
    localStorage.removeItem("completedocId");
    localStorage.setItem("viewClient", client);
    // localStorage.setItem("fulfilmentSave", fulfilment)
    localStorage.setItem("viewCompany", company);
    localStorage.setItem("viewDocId", docId);
    this.viewClient = localStorage.getItem("viewClient");
    this.viewCompany = localStorage.getItem("viewCompany");
    this.viewDocId = localStorage.getItem("viewDocId");
    this.formdata = new FormData;
    this.service.sendRemainder(docId).subscribe((x) => {
      console.log(x);
      let obj1: sendRemainder = x;
      // = "nxtsign"
      if (!obj1.Type) {
        console.log(x);
        this.service.getDocAtts(this.viewDocId, this.viewClient, this.viewCompany).subscribe((x: string[]) => {
          let Atts = x;
          this.service.getfilefromPostGres(x).subscribe((y: DocReturnData[]) => {
            y.forEach(q => {
              const blob = this.dataURItoBlob(q.files)
              const file = new File([blob], q.fileName, { 'type': q.fileType })
              console.log(file);


              var client = obj1.client;
              this.service.returnRemainder(client).subscribe((y: any) => {
                console.log(y);
                let obj2: emailsender = y;
                var userid = obj2.Username;
                var email = obj2.Email;

                this.formdata = new FormData();
                this.formdata.append("DocID", userid);
                this.formdata.append("senderEmail", email);
                this.formdata.append("File", file);
                // this.formdata.append("Files",)
                console.log(this.formdata.get("DocID"))
                this.service.sendEmail(this.formdata).subscribe((z: any) => {
                  console.log("formdata", z);
                  this.hidespin1 = false;
                  this._snackBar.open('Remainder sent successfully', '', {
                    duration: 2000,
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    panelClass: 'i' === 'i' ? 'success' : 'info'
                  });
                  // this.snackbar.openSnackBar("Remainder sent successfully", SnackBarStatus.success, 2000);
                })
                this.hidespin1 = false;
                this._snackBar.open('Remainder Not Sent ', '', {
                  duration: 2000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                  panelClass: 'i' === 'i' ? 'danger' : 'info'
                });
              })
            })
          })
        })
      }



    })

  }
  onSelect(selectedItem: DocHeaderDetail) {
    this.hidespin1 = true;
    console.log("Selected item Id: ", typeof selectedItem.docId); // You get the Id of the selected item here
    let params = new HttpParams();
    params = params.append("DocId", selectedItem.docId)

    // this.employeesDataSource = new MatTableDataSource(data);
    // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
    this.service.DeleteData(selectedItem.docId).subscribe(
      (data: any[]) => {
        console.log(data);


        const index: number = this.AllRecords.indexOf(selectedItem);
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '40%',
          data: { message: 'Are you sure you want to release the GRN?' }
        });
        dialogRef.afterClosed().subscribe(resultVal => {
          if (resultVal === 'yes') {

            if (index > -1) {
              this.AllRecords.splice(index, 1);
            }
            if (selectedItem.fulfilment == "Released") {
              this.signlength1 = this.signlength1 - 1;
            }
            if (selectedItem.fulfilment == "Completed") {
              this.signcompletelength1 = this.signcompletelength1 - 1;
            }
            if (selectedItem.fulfilment == "Signing") {
              this.signcompletelength3 = this.signcompletelength3 - 1;
            }
            this.activeLink = "all";
            this.employeesDataSource = new MatTableDataSource(this.AllRecords);
            // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
            this.hidespin1 = false;
            this._snackBar.open('Deleted successfully', '', {
              duration: 2000,
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              panelClass: 'i' === 'i' ? 'success' : 'info'
            });
          }
          (err) => {
            console.error(err);
          }
        }
        )
      }
    )

  }


  setColor(fulfilment, completeby: Date) {
    let Fulfilment = fulfilment;
    let Comp = new Date(completeby)

    if ((Fulfilment == "Draft" || Fulfilment == "Released") && (Comp < this.currentDate)) {
      
      return 'red';
    }
    else {
      return 'black';
    }

  }
  // CurrentDate:any;


}
// setColor(fulfilment,completeby:Date){
//   let Fulfilment = fulfilment;
//   let Comp=new Date(completeby)

//   if((Fulfilment == "Draft" || Fulfilment == "Released") && (Comp < this.currentDate))
//   {
//     return 'red';
//   }
//   else{
//     return 'black';
//   }

// }


