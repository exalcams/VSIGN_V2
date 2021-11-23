import { SelectionModel } from '@angular/cdk/collections';
import { TreeControl, NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
// import { MatTreeFlattener, MatTreeFlatDataSource, MatDialog, MatTableDataSource, MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationDetails } from 'src/app/models/master';
// import { SubNodeDialogComponent } from 'src/app/sub-node-dialog/sub-node-dialog.component';
import { BehaviorSubject, forkJoin, Observable, of as ofObservable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DocReturnData } from 'src/app/page/repository/models/returnfile.model';
import { DashboardService1 } from './service/dashboard1.service';
import { DocHeaderDetail } from 'src/app/page/repository/models/DashboardTable.model';
import { emailsender } from 'src/app/page/repository/models/RemainderEmail.model';
import { sendRemainder } from 'src/app/page/repository/models/SendRemainder.model';
import { DocTag } from './models/Tag.model';
import { CreatedialogComponent } from './createdialog/createdialog.component';
import { FlatNode, TreeItem } from './models/Tag.model';
import { TagService } from './service/tag.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTreeFlattener,MatTreeFlatDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/service/auth.service';
export class TodoItemNode {
  children: TodoItemNode[] | any;
  item: string | any;
}
export class TodoItemFlatNode {
  item: string | any;
  level: number | any;
  expandable: boolean | any;
}
var TREE_DATA: any = []
@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],

})
export class RepositoryComponent implements OnInit {
  employeesDataSource: MatTableDataSource<any>;
  employeesDisplayColumns: string[] = ['title', 'author', 'date', 'fulfilment', 'signed', 'completeby'];
  DocId: any = [];
  AllRecords = [];
  DocList = [];
  dtag: any = [];
  viewClient: string = "";
  viewCompany: string = "";
  viewDocId: string = "";
  formdata: FormData;
  dtag1: any = [];
  myControl = new FormControl();
  filteredOptions: Observable<any[]>;
  InputMain: any;
  length: any = 0;
  TREE_DATA: TreeItem[] = [];
  duplicateselecetedarray: any = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  childrenlength: any = 0;
  InitiatedRecords: DocHeaderDetail[] = [];
  NxtSignRecords: DocHeaderDetail[] = [];
  SignedRecords: DocHeaderDetail[] = [];
  Table_Data: any = [];
  Table_Data1: any = [];
  dataChange: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<TodoItemNode[]>([]);
  node: any;
  selecteddocId: any;
  hidespin1: boolean;
  selectedNode: string;
  newItemName: string = '';
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  maskComponents: any[] = [];
  curruser: AuthenticationDetails;
  displayname: string = "";
  private _transformer = (node: TreeItem, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      id: node.id
    };
  }
  treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: FlatNode) => node.expandable;
  selectedarray: any[];
  siteIDofselectedspace: any;
  sitenameofselectednode: any;
  parentofSelectedId: any;
  parentofSelectedname: any;
  selectedId: any;
  treeSource: any;
  constructor(private _authService: AuthService,public dialog: MatDialog, private _snackBar: MatSnackBar,private spinner: NgxSpinnerService, private _tagservice: TagService, private service: DashboardService1, private router: Router) {
    this.curruser = JSON.parse(localStorage.getItem("authorizationData"));
    this.displayname = this.curruser.DisplayName;
  }
  ngOnInit() {
    this._authService.isLoggedin(true);
    this.GetHierarchy();
    this.Tag();
    this.GetDashBoard();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }
  GetDashBoard(){
    this.getAllDashBoardData().subscribe((x: any) => {
      this.InitiatedRecords = x[0];
      this.NxtSignRecords = x[1];
      this.SignedRecords = x[2];
      const tableRecords = [];
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
      //console.log(tableRecords);


      this.AllRecords = tableRecords.reverse();
      // this.hidespin = false;
      // this.employeesDataSource = new MatTableDataSource(this.AllRecords);
      this.DocList = tableRecords;
      //console.log(this.DocList);
    })
  }
  Tag(){
    this._tagservice.getTags().subscribe((g: DocTag) => {
      // console.log(g[0].docId);
      this.dtag.push(g);
      for (let i = 0; i < this.dtag[0].length; i++) {
        this.dtag1.push(this.dtag[0][i].tagName);
      }
      // console.log(this.dtag1)
    })
  }
  GetHierarchy(){
    this.spinner.show();
    this._tagservice.Gettreehierarchy().subscribe(data => {
      this.TREE_DATA = <TreeItem[]>data;
      // this.duplicateselecetedarray=[];
      this.duplicateselecetedarray.push(this.TREE_DATA[0]);
       //console.log("tree data", this.TREE_DATA);
      this.dataSource.data = this.treeConstruct(this.TREE_DATA);
      //console.log("tree data", this.TREE_DATA);
      this.TREE_DATA.forEach(element => {
        if(element.type =="Parent")
        {
          this.length ++;
        }
        else if (element.type =="Child")
        {
          this.childrenlength++;
        }
      });
      console.log(this.length);
      this.selectedNode = this.TREE_DATA[0].name;
      this.spinner.hide();
    });
  }
  getAllDashBoardData(): Observable<any> {
    return forkJoin([this.service.getInitiatedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getNxtSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getSignedTableContents(this.curruser.ClientID, this.curruser.Company), this.service.getKPI(this.curruser.ClientID, this.curruser.Company), this.service.getProgress(this.curruser.ClientID, this.curruser.Company)]);
  }
  OpenMainDialog(): void {

    const dialogRef = this.dialog.open(CreatedialogComponent, {
      height: '55%',
      width: '55%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
      
      res.child="Child";
      if (res != null) {
        //console.log(res, "Tree")
        this.spinner.show();
        this._tagservice.PostTree(res).subscribe(data => {
          this.UpdateTree();
          this.spinner.hide()
        })
      }
      this.spinner.hide();
    });
  }
  OpenMainDialog1(node): void {

    const dialogRef = this.dialog.open(CreatedialogComponent, {data:node,
      height: '52%',
      width: '50%'
    });
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(res => {
     
      res.child="Child",
      res.id = node.id;
      if (res != null) {
       // console.log(res, "Tree")
       this.spinner.show();
        this._tagservice.PostsubTree(res).subscribe(data => {
          this.UpdateTree();
          this.spinner.hide();
        })
      }
      this.spinner.hide();
    });
  }
  getParent(node) {
    const { treeControl } = this;
    const currentLevel = treeControl.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = treeControl.dataNodes[i];

      if (treeControl.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
  }
  setSelectedNode(node) {
    console.log("node",node);
    // this.selectedNode = node.name;
    // this.selectedId=node.id;
   
   this.selectedarray=[];
   this.selectedarray.push(node)
 
   if(node.level >0)
   {
   
     for(var i=node.level;i>0;i--)
     {
     
        var currentlevel= this.getParent(node);
        this.selectedarray.push(currentlevel)
      
       node=currentlevel;
     
     }
  
   }
   this.duplicateselecetedarray=[]
   var z=0;
 for(var j=(this.selectedarray.length-1);j>=0;j--)
 {
   
   this.duplicateselecetedarray[z]=this.selectedarray[j]
   z=z+1;
 }
 this.siteIDofselectedspace=this.duplicateselecetedarray[0].id;
 this.sitenameofselectednode=this.duplicateselecetedarray[0].name
 this.parentofSelectedId= this.duplicateselecetedarray[this.duplicateselecetedarray.length-1].name;
 this.parentofSelectedname=this.duplicateselecetedarray[this.duplicateselecetedarray.length-1].id
   this.selectedNode =this.selectedarray[0].name;
    this.selectedId=this.selectedarray[0].id;
  }
  UpdateTree() {
    this._tagservice.Gettreehierarchy().subscribe(data => {
      this.TREE_DATA = <TreeItem[]>data;
      this.dataSource.data = this.treeConstruct(this.TREE_DATA);
      this.length=0;
      this.childrenlength=0;
      this.TREE_DATA.forEach(element => {
        if(element.type =="Parent")
        {
          this.length ++;
        }
        else if (element.type =="Child")
        {
          this.childrenlength++;
        }
      });
      console.log(data);
    })
  }

  treeConstruct(treeData) {

    let constructedTree = [];
    for (let i of treeData) {
      let treeObj = i;
      let assigned = false;
      this.constructTree(constructedTree, treeObj, assigned)
    }
    return constructedTree;
  }
  constructTree(constructedTree, treeObj, assigned) {

    if (treeObj.parent == 0) {

      treeObj.children = [];

      constructedTree.push(treeObj);

      return true;

    }


    else if (treeObj.parent == constructedTree.id && treeObj.type == "Child" && constructedTree.type == "Parent") {



      treeObj.children = [];

      constructedTree.children.push(treeObj);

      return true;

    }

    else if(treeObj.parent == constructedTree.id && treeObj.type == "Child" && constructedTree.type =="Child")

      {

        treeObj.children = [];

        constructedTree.children.push(treeObj);

        return true;

      }
    else {

      if (constructedTree.children != undefined) {

        for (let index = 0; index < constructedTree.children.length; index++) {

          let constructedObj = constructedTree.children[index];

          if (assigned == false) {

            assigned = this.constructTree(constructedObj, treeObj, assigned);

          }

        }

      } else {

        for (let index = 0; index < constructedTree.length; index++) {

          let constructedObj = constructedTree[index];

          if (assigned == false) {

            assigned = this.constructTree(constructedObj, treeObj, assigned);

          }

        }

      }

      return false;

    }

  }
  logNode(node) {
    console.log(node);
    this.node = node;
    this._tagservice.getTags().subscribe((g: DocTag) => {
      this.DocId = g;
      // console.log();
      const Id = this.DocId.filter(x=>{return x.tagName == node})
      console.log(Id);
      // Id
      this.Table_Data = this.DocList.filter(x => { return x.docId == Id[0].docId });
      console.log(this.Table_Data);
      for (let i = 0; i < this.Table_Data.length; i++) {
        this.Table_Data1.push(this.Table_Data[i]);
        console.log(this.Table_Data1);
      }
      //  this.Table_Data1.push(this.Table_Data);
      //  console.log(this.Table_Data1);
      this.employeesDataSource = this.Table_Data;
    })
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.dtag1.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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
  sign(client, company, docId, fulfilment, author, createdon, completeby) {
    // this.CreateActionLogvalues("Signing DocumentCenter Attachment");
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
    this.router.navigate(['/pages/sign']);
  }
  view(client, company, docId, fulfilment) {
    // this.CreateActionLogvalues("View DocumentCenter Attachment");

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
    this.router.navigate(['/pages/create']);

  }
  viewDoc(client, company, docId, fulfilment, author, createdon, completeby) {
    // this.CreateActionLogvalues("View DocumentCenter Attachment");
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

    this.router.navigate(['/pages/sign']);
  }
  // sendRemainder(docId) {
  //   this.formdata = new FormData;
  //   this.service.sendRemainder(docId).subscribe((x) => {
  //     console.log(x);
  //     let obj1: sendRemainder = x;
  //     if (obj1.Type = "nxtsign") {
  //       console.log(x);
  //       var client = obj1.client;
  //       this.service.returnRemainder(client).subscribe((y: any) => {
  //         console.log(y);
  //         let obj2: emailsender = y;
  //         var userid = obj2.Username;
  //         var email = obj2.Email;

  //         // this.formdata = new FormData();
  //         this.formdata.append("DocID", userid);
  //         this.formdata.append("senderEmail", email);
  //         this.service.sendEmail(this.formdata).subscribe((z: any) => {
  //           console.log("formdata", z);

  //           this.snackbar.openSnackBar("Remainder sent successfully", SnackBarStatus.success, 2000);
  //         })
  //       })
  //     }



  //   })

  // }
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
    this.selecteddocId = docId;
    this.hidespin1 = true;
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
    // let params = new HttpParams();
    // params = params.append("DocId", selectedItem.docId)

    // this.employeesDataSource = new MatTableDataSource(data);
    // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
    this.service.DeleteData(selectedItem.docId).subscribe(
      (data: any[]) => {
        console.log(data);
        const index: number = this.Table_Data.indexOf(selectedItem);
        if (index > -1) {
          this.Table_Data.splice(index, 1);
        }
        // this.signlength=data.filter(x => { return x.fulfilment == "Released" });
        // this.signlength1=this.signlength.length;
        // this.signcompletelength=data.filter(x => { return x.fulfilment == "Completed" });
        // this.signcompletelength1=this.signcompletelength.length;
        // this.signcompletelength2=data.filter(x => { return x.fulfilment == "In Signing" });
        // this.signcompletelength3=this.signcompletelength2.length;
        // if (selectedItem.fulfilment == "Released") {
        //   this.signlength1 = this.signlength1 - 1;
        // }
        // if (selectedItem.fulfilment == "Completed") {
        //   this.signcompletelength1 = this.signcompletelength1 - 1;
        // }
        // if (selectedItem.fulfilment == "In Signing") {
        //   this.signcompletelength3 = this.signcompletelength3 - 1;
        // }
        this.employeesDataSource = new MatTableDataSource(this.Table_Data);
        this.hidespin1 = false;
        // this.snackbar.openSnackBar("Deleted successfully", SnackBarStatus.success, 2000);
        this._snackBar.open('Deleted successfully', '', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          panelClass: 'i' === 'i' ? 'success' : 'info'
        });
      },
      (err) => {
        console.error(err);
      }
    )

  }




}
