import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { createdoc } from '../new-doucument/models/createdoc.model';
import { docapp } from '../new-doucument/models/docapp.model';
import { ReleaseDocParams } from '../new-doucument/models/releaseparam.model';
import { SignedAttIDs } from './Model/AttandAtt1.model';
import { DocAtt } from './Model/DocAtt.model';

@Injectable({
  providedIn: 'root'
})
export class SignandUpdatedocService {
  // baseurl = 'http://192.168.0.25:7058/';
  baseurl1 ="http://192.168.0.25:9001/"

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) { }
  Signthedocument(formData: FormData): Observable<any> {
    return this.httpClient.post<any>(this.baseurl1+"api/SignDoc/GetDocumentSigned", formData);
  }
  Savethedocument(Doc:createdoc, DocId , Company , Client): Observable<any> {
    return this.httpClient.put<any>(this.baseurl1 + "api/SaveDoc/UpdateDoc?DocId="+DocId+"&Company="+Company+"&Client="+Client, Doc);
  }
  UpdatethedocAtt(Doc:DocAtt, DocId , Company , Client , AttId): Observable<any> {
    return this.httpClient.put<any>(this.baseurl1 + "api/Attachment/UpdateAttachment?DocId="+DocId+"&Company="+Company+"&Client="+Client+"&AttId="+AttId , Doc);
  }

  UpdateinPGSQL(id:string,formData:FormData){
    return this.httpClient.put<any>("http://192.168.0.25:9002/api/DocFiles/UpdateDocument?id="+id,formData);
  }

  postfiletoPostGres(formdata: any): Observable<any> {
    console.log("formdata",formdata);
    return this.httpClient.post<any>("http://192.168.0.25:9002/api/DocFiles/AddDocumentVsign", formdata);
    
  }

  UpdateAttIds(attids:SignedAttIDs){
    return this.httpClient.post<any>("http://192.168.0.25:9001/api/SaveDoc/UpdateSignedAtt",attids)
  }
  releaseDoc(release:ReleaseDocParams){
    return this.httpClient.post<any>("http://192.168.0.25:9001/api/Release/ReleaseDoc",release);
  }
  //  192.168.0.25:5090 this.baseurl1+
  SignByImgService(files:FormData){
    return this.httpClient.post<any>("http://192.168.0.25:9001/api/SignByImg/PdfSignImg",files)
  }
  Tagsigning(model: any): Observable<any> {
    return this.httpClient.post(`http://192.168.0.25:9004/api/AutoSign/GetSignedForDocument`,
      model,
      {
        observe: 'response', responseType: 'blob',
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
     
  }
}
