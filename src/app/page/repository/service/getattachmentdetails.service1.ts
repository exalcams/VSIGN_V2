import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { docapp } from '../models/docapp.model';
// import { docapp } from '../new-doucument/models/docapp.model';
import { DocAppLog } from '../models/AppLog.model';
import { FilenameAndDocIDs } from '../models/FilenamesandAttIDs.model';

@Injectable({
  providedIn: 'root'
})
export class GetattachmentdetailsService1 {
  // baseurl = 'http://192.168.0.25:7058/';
  // baseurl1 = 'http://192.168.0.25:7060/';
  baseurl1 = 'http://192.168.0.25:9002/';
  baseurl = 'http://192.168.0.25:9003/';
  baseurl2="http://192.168.0.25:9001/"
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) { }
  getAttachmentDetails(client: string, company: string, DocId: string): Observable<any> {
    return this.httpClient.get<any>(this.baseurl2 + "api/Attachment/getAttDetails?DocId=" + DocId + "&Company=" + company + "&Client=" + client);
  }
  getAttachmentPosgresql(AttachmentId: string): Observable<any> {
    return this.httpClient.get<any>(this.baseurl1 + "api/DocFiles/GetDocument?id=" + AttachmentId);
  }
 
  getFnamesAndIds(ids:string[]):Observable<FilenameAndDocIDs[]>{
    return this.httpClient.post<any>(this.baseurl1+"api/DocFiles/GetNameandIds",ids);
  }

  getPdfImg(id:string,pg:string):Observable<any>{
    return this.httpClient.get<any>("http://192.168.0.25:9002/api/PdfImage/GetPdfImg?Docid="+id+"&pgno="+pg);
  }
  updateDocApp(doc:docapp):Observable<any>{
    return this.httpClient.post<any>(this.baseurl2+"api/SaveDoc/SignByUser",doc)
  }

  getfilefromPostGres(ids:string[]):Observable<any>{
    return this.httpClient.post<any>("http://192.168.0.25:9002/api/DocFiles/GetDocumentList",ids);
  }
   getIPAddress()  
  {  
    return this.httpClient.get("http://api.ipify.org/?format=json");  
  } 

  getOneUser(clientID){
    return this.httpClient.get(this.baseurl+"api/Master/GetOneUser?clientID="+clientID);
  }

  SendConfirmationEmail(files:FormData)
  {
    return this.httpClient.post<any>(this.baseurl+"/api/EmailApi/SendConfirmedEmail",files);
  }

  createLog(log:DocAppLog){
    return this.httpClient.post<any>(this.baseurl2+"api/CreateDoc/AddAppLog",log);
  }
}
