import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserWithRole } from 'src/app/models/master';
import { Observable } from 'rxjs';
import { DocAppLog } from '../models/AppLog.model';
import { createdoc } from '../models/createdoc.model';
import { DocDistMail } from '../models/DistMail.model';
import { docapp } from '../models/docapp.model';
import { docatt } from '../models/docatt.model';
import { ReleaseDocParams } from '../models/releaseparam.model';
import { DocTag } from '../models/Tag.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }
  private baseUrlpostGres = 'http://192.168.0.25:9002/api/DocFiles/AddDocument';
  private baseUrlVsign = 'http://192.168.0.25:9003/'
  private baseUrlVsign1="http://192.168.0.25:9001/"
  // private baseUrlVsign1='http://192.168.0.25:9001/'
  //   headers={
  //     headers: new HttpHeaders({
  //       'enctype': 'multipart/form-data',
  //       'Accept': 'application/json'
  //     })
  // };
  postfiletoPostGres(formdata: any): Observable<any> {
    console.log("formdata",formdata);
    return this.http.post<any>("http://192.168.0.25:9002/api/DocFiles/AddDocumentVsign", formdata);
    
  }
  getTags():Observable<any>{
    return this.http.get<any>(this.baseUrlVsign1+"api/getTag/GetAllTags");
  }
  getfilefromPostGres(ids:string[]):Observable<any>{
    return this.http.post<any>("http://192.168.0.25:9002/api/DocFiles/GetDocumentList",ids);
  }

  postdatatoDocH(doc: createdoc[]): Observable<any> {
    console.log("doc", doc);

    return this.http.post<any>(this.baseUrlVsign1 + "api/CreateDoc/AddDocH", doc);
  }

  postdatatodocapp(app: docapp[]): Observable<any> {
    console.log(app);


    return this.http.post<any>(this.baseUrlVsign1 + "api/CreateDoc/AddDocApp", app);
  }

  postdatatoDistMail(Distmails:DocDistMail[]):Observable<any>{
    return this.http.post<any>(this.baseUrlVsign1 +"api/CreateDoc/AddDocDistMail", Distmails);
  }

  postdatatodocatt(att: docatt[]): Observable<any> {
    console.log(att);

    return this.http.post<any>(this.baseUrlVsign1 + "api/CreateDoc/AddDocAtt", att);
  }
  getUsers():Observable<any>{
    return this.http.get(this.baseUrlVsign+"api/master/GetVisgnUserWithRoles");
  }

  getDocAtts(DocId:string,Client,Company):Observable<any>{
   return this.http.get<any>(this.baseUrlVsign1+"api/ViewDoc/GetDocAtts?DocId="+DocId+"&Client="+Client+"&Company="+Company);
  }

  getDocHdata(DocId:string,Client,Company):Observable<any>{
    return this.http.get<any>(this.baseUrlVsign1+"api/ViewDoc/GetDocHData?DocId="+DocId+"&Client="+Client+"&Company="+Company);
   }

   getLevelUsers(DocId:string,Client,Company):Observable<any>{
    return this.http.get<any>(this.baseUrlVsign1+"api/ViewDoc/GetDocApps?DocId="+DocId+"&Client="+Client+"&Company="+Company);
   }


   deleteUsers(apps:string[]){
     return this.http.post<any>(this.baseUrlVsign1+"api/SaveDoc/DeleteDocApps",apps)
   }
   deleteAtts(atts:string[]){
    return this.http.post<any>(this.baseUrlVsign1+"api/SaveDoc/DeleteDocAtts",atts)
  }
   deleteAttPostGres(atts:string[]){
    return this.http.post<any>("http://192.168.0.25:9002/api/DocFiles/DeleteDocument",atts)
   }

   updateDoch(doch:createdoc[]){
     return this.http.post<any>(this.baseUrlVsign1 +"api/SaveDoc/UpdateDocH",doch);
   }

   updateDocAtt(doch:docatt[]){
    return this.http.post<any>(this.baseUrlVsign1+"api/SaveDoc/UpdateDocAtt",doch);
  }

   releaseDoc(release:ReleaseDocParams){
     return this.http.post<any>(this.baseUrlVsign1+"api/Release/ReleaseDoc",release);
   }

   getAllRefs(){
     return this.http.get<any>(this.baseUrlVsign1+"api/ManageRef/GetAllRefs")
   }


   createTag(tag:DocTag){
     return this.http.post<any>(this.baseUrlVsign1+"api/getTag/CreateTag",tag);
   }
   updateTag(tag:DocTag){
     return this.http.post<any>(this.baseUrlVsign1+"api/getTag/UpdateTag",tag);
   }

   getTag(client:string,company:string,docid:string){
     return this.http.get<any>(this.baseUrlVsign1+"api/getTag/getTagbyId?client="+client+"&company="+company+"&docid="+docid);
   }
   getIPAddress()  
   {  
     return this.http.get<any>("https://api.ipify.org");  
   } 

   createLog(log:DocAppLog){
     return this.http.post<any>(this.baseUrlVsign1+"api/CreateDoc/AddAppLog",log);
   }

   updateLog(log:DocAppLog){
     return this.http.post<any>(this.baseUrlVsign1+"api/SaveDoc/UpdateLog",log);
   }
   createTempUser(tempusers:UserWithRole[]){
    return this.http.post<any>("http://192.168.0.25:9003/api/Master/CreateTempUser",tempusers);
  }
}
