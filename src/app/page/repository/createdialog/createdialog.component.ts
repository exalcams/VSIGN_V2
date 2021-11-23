import { Component, ElementRef, Inject, OnInit, Optional, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { DocTag } from '../models/Tag.model';
import { TagService } from '../service/tag.service';

@Component({
  selector: 'app-createdialog',
  templateUrl: './createdialog.component.html',
  styleUrls: ['./createdialog.component.scss']
})
export class CreatedialogComponent implements OnInit {
  @ViewChildren('a') a: QueryList< ElementRef>;
myForm: FormGroup;
myControl = new FormControl();
arr: FormArray;
InputMain:any;
  dtag:any=[];
  dtag1:any=[];
Enable :boolean = true;
  //myControl :FormGroup;
  //TreeArray: FormArray;
  filteredOptions: Observable<any[]>;
  duplicateselecetedarray: any[];
  lastindex: any =0;
  value: any;
constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<CreatedialogComponent>,
   @Optional() @Inject(MAT_DIALOG_DATA) public data: any,private _tagservice:TagService) { }

ngOnInit() {
  this.myForm = this.fb.group({
    arr: this.fb.array([this.createItem()])
  });
  this._tagservice.getTags().subscribe((g: DocTag) => {
    console.log(g[0].docId);
    this.dtag.push(g);
    for(let i=0;i<this.dtag[0].length;i++)
    {
      this.dtag1.push(this.dtag[0][i].tagName);
    }
    console.log(this.dtag1)
  })
      
  // this.filteredOptions = this.myForm.valueChanges.pipe(
  //   startWith(''),
  //   map(value => this._filter(value))
  // );
}
filtertag(index){
  // this._filter(this.value)
  let s = this.myForm.controls["arr"] as FormArray;
  console.log(s.controls[index])
  this.filteredOptions = s.controls[index].valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value))
  );
}
createItem() {
  return this.fb.group({
    Node: [''],
  })
}

addItem(i:any) {
this.lastindex=i;
console.log(this.lastindex)
  this.arr = this.myForm.get('arr') as FormArray;
  // console.log(this.myForm.value);
  this.arr.push(this.createItem());
  console.log(this.a.length);
  
  this.a.changes.pipe(take(1)).subscribe({
    next: changes => changes.last.nativeElement.focus()
  })
  this.duplicateselecetedarray=[];
var z=0;
//console.log(this.myForm.value.arr.length-1);
for(var j=0;j<=(this.myForm.value.arr.length-1);j++)
{

this.duplicateselecetedarray[z]=this.myForm.value.arr[j]
z=z+1;

}

this.duplicateselecetedarray.pop();
console.log(this.duplicateselecetedarray)
}

onSubmit() {
  console.log(this.myForm.value);
}
Create():void{
  // console.log(this.myForm.value);
      this.dialogRef.close(this.myForm.value);
    }


private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
  
      return this.dtag1.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
}


    removeGroup(index) {
      const form = this.myForm.get('arr') as FormArray
      form.removeAt(index);
      console.log(this.myForm.value);
      this.duplicateselecetedarray=[];
      var z=0;
      //console.log(this.myForm.value.arr.length-1);
      for(var j=0;j<=(this.myForm.value.arr.length-1);j++)
      {
      
      this.duplicateselecetedarray[z]=this.myForm.value.arr[j]
      z=z+1;
      
      }
      
      this.duplicateselecetedarray.pop();
      console.log(this.duplicateselecetedarray)
    }
}