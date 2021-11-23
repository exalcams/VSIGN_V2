import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { DocHeaderDetail } from '../models/DashboardTable.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService1 {
  // baseurl = 'http://192.168.0.25:7058/';
   baseurl='http://192.168.0.25:9001/'
 // baseurl = 'http://192.168.0.25:5090/';
  //baseAddress="http://192.168.0.25:5090/"
   baseAddress='http://192.168.0.25:9001/'
  // "http://192.168.0.25:9001/"http://192.168.0.25:5090/
  private baseUrlVsign1='http://192.168.0.25:9001/'
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) { }
  errorHandler(error: HttpErrorResponse): Observable<string> {
    return throwError(error.error || error.message || 'Server Error');
  }
  getInitiatedTableContents(client: string, company: string): Observable<any> {
    return this.httpClient.get<any>(this.baseurl + "api/getDocList/getAllDocumentsInitiated?Client=" + client + "&Company=" + company);
  }
  GetActiveTag(docId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseurl}poapi/Dashboard/GetAllTags?docId=${docId}`)
      .pipe(catchError(this.errorHandler));
  }
  DeleteData(DocId:any):Observable<any>{
    return this.httpClient.get<any>(`http://192.168.0.25:9001/api/SaveDoc/DeleteData?DocId=${DocId}`);
  }
  // GetActiveTag(docId: TagDetails): Observable<any> {
  //   return this.httpClient.post<any>(`${this.baseurl}poapi/Dashboard/CreateTag`,
  //     docId,
  //     {
  //       headers: new HttpHeaders({
  //         'Content-Type': 'application/json'
  //       })
  //     })
  //     .pipe(catchError(this.errorHandler));
  // }
  getNxtSignedTableContents(client: string, company: string): Observable<any> {
    return this.httpClient.get<any>(this.baseurl + "api/getDocList/getAllDocumentsToBeSigned?Client=" + client + "&Company=" + company);
  }
  getSignedTableContents(client: string, company: string): Observable<any> {
    return this.httpClient.get<any>(this.baseurl + "api/getDocList/getAllDocumentsSigned?Client=" + client + "&Company=" + company);
  }
  getKPI(client: string, company: string): Observable<any> {
    return this.httpClient.get<any>(this.baseurl + "api/getKPI/getSignedDocsCount?Client=" + client + "&Company=" + company);
  }

  getProgress(client: string, company: string): Observable<any> {
    return this.httpClient.get<any>(this.baseurl + "api/getProgress/getSigningProcess?Client=" + client + "&Company=" + company);
  }
  getTags(client: string, company: string): Observable<any> {
    return this.httpClient.get<any>(this.baseurl + "api/getTag/getAllTags");
  }

  sendRemainder(docId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseurl +"api/SendRemainder/SendRemainderController1?id=" + docId);
  }
  sendRemainder1(docId: any): Observable<any> {
    return this.httpClient.get<any>(this.baseurl +"api/SendRemainder/SendRemainderController2?id=" + docId);
  }
  returnRemainder(client: string): Observable<any> {
    console.log("client", client);
    return this.httpClient.get<any>("http://192.168.0.25:9003/api/Master/returnRemainder?ClientID=" + client);
  }
  sendEmail(formdata: any) {
 
    console.log(formdata);
    return this.httpClient.post<any>(this.baseurl +"api/SendRemainder/sendEmail", formdata);
  }
  sendEmail1(formdata: any) {
 
    console.log(formdata);
    return this.httpClient.post<any>("http://192.168.0.25:9001/api/SendRemainder/sendEmail1", formdata);
  }
  getDocAtts(DocId:string,Client,Company):Observable<any>{
    return this.httpClient.get<any>(this.baseUrlVsign1+"api/ViewDoc/GetDocAtts?DocId="+DocId+"&Client="+Client+"&Company="+Company);
   }
   getfilefromPostGres(ids:string[]):Observable<any>{
     
    return this.httpClient.post<any>("http://192.168.0.25:9002/api/DocFiles/GetDocumentList",ids,
    {
              headers: new HttpHeaders({
                'Content-Type': 'application/json'
              })
            });
  }
  FilterTableData(
    UserName: string,
    FromDate: string,
    ToDate: string,
    client: string, company: string,
    filter:DocHeaderDetail[]
): Observable<any | string> {
  var obj={"UserName":UserName,"FromDate":FromDate,"ToDate":ToDate,"client":client,"company":company,"filter":filter}
    return this.httpClient
        .post<any>(
            `${this.baseAddress}api/getDocList/FilterTableData`,obj,
        )
        // ?UserName=${UserName}&FromDate=${FromDate}&ToDate=${ToDate}&Client=${client}&Company=${company}&Filter=${filter}
        .pipe(catchError(this.errorHandler));
}
 
}
