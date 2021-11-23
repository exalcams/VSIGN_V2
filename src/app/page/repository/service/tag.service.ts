import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core'; import { Observable } from 'rxjs';
import { DocTag } from '../models/Tag.model';
@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(private http: HttpClient) { }
  private baseUrlVsign = 'http://192.168.0.25:9001/'
  getTags(): Observable<any> {
    return this.http.get<any>(this.baseUrlVsign + "api/getTag/GetAllTags1");
  }
  PostTree(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrlVsign + "api/Tree/CreateAllSave", data
      ,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }
  PostsubTree(data: any): Observable<any> {
    console.log(data,"postdata")
    return this.http.post<any>(this.baseUrlVsign + "api/Tree/CreateSubChild", data
      ,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
  }
  Gettreehierarchy(): Observable<any> {
    return this.http.get<any>(this.baseUrlVsign + "api/Tree/GetTreedata")};
}