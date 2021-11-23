import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { digital } from './signing';
import { FileDocID } from './Model/FileDocID.model';
import { ReleaseDocParams } from '../new-doucument/models/releaseparam.model';
 
@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  baseurl = 'http://192.168.0.25:5010/vsignapi/VSign/GetVSigns';
  usbtokenlocalhost = 'http://localhost:8170/';
  // usbtokenlocalhost="http://192.168.0.25:8170/"
  aadharlocalhost= 'http://192.168.0.25:5055/api/GenerateRequestXML/aadhar';
  aadharlocalhost1= 'https://localhost:44388/api/GenerateRequestXML/aadhar';
  // aadharlocalhost= 'http://localhost:44388/api/GenerateRequestXML/aadhar';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) {
  }
  getDB(): Observable<digital[]> {
    return this.httpClient.get<digital[]>(`${this.baseurl}`);
  }
  USBSignDocument(b64:string): Observable<any> {
    return this.httpClient.post<any>(this.usbtokenlocalhost, b64);
  }
  // AadharSignDocument(_filename:any):Observable<any>{
  //   return this.httpClient.get<any>(this.aadharlocalhost,{responseType: 'text'});
  // }
   AadharSignDocument(_filename:any):Observable<any>{
    return this.httpClient.get(this.aadharlocalhost1,{responseType: 'text'});
  }
  //192.168.0.25:5055
  UpdateAttIds(attids:FileDocID){
    return this.httpClient.post<any>("http://192.168.0.25:9001/api/SaveDoc/UpdateSignedAtt",attids)
  }
  releaseDoc(release:ReleaseDocParams){
    return this.httpClient.post<any>("http://192.168.0.25:9001/api/Release/ReleaseDoc",release);
  }
  postfiletoPostGres(formdata: any): Observable<any> {
    console.log("formdata",formdata);
     return this.httpClient.post<any>("http://192.168.0.25:9002/api/DocFiles/AddDocumentVsign", formdata);
    //return this.httpClient.post<any>("http://localhost:62271/api/DocFiles/AddDocumentVsign", formdata);
  }
  postfiletoPostGres1(formdata: any): Observable<any> {
    console.log("formdata",formdata);
     return this.httpClient.post<any>("http://192.168.0.25:9002/api/DocFiles/AddDocumentVsign1", formdata);
    //return this.httpClient.post<any>("http://localhost:62271/api/DocFiles/AddDocumentVsign", formdata);
  }

  GetPDFImage(f:FormData):Observable<any>{
        
    return this.httpClient.post<any>("http://192.168.0.25:7165/api/SignPostion/GetPDFImage",f)
        }
        // http://192.168.0.25:7165 localhost:61591
        SignPDFWithCoordinates(f:FormData):Observable<any>{
            
            return this.httpClient.post<any>("http://192.168.0.25:7165/api/SignPostion/SignPDFwithCoordinates",f)
                }

}