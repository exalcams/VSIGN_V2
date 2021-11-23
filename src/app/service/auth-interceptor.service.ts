import { Injectable, Compiler } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationDetails } from 'src/app/models/master';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationSnackBarComponent } from 'src/app/notifications/notification-snack-bar/notification-snack-bar.component';
//import { SnackBarStatus } from 'app/notifications/notification-snack-bar/notification-snackbar-status-enum';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  authenticationDetails: AuthenticationDetails;
  baseAddress: string;
  notificationSnackBarComponent: NotificationSnackBarComponent;
  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _compiler: Compiler,
    public snackBar: MatSnackBar,
  ) {
    this.authenticationDetails = new AuthenticationDetails();
    this.baseAddress = this._authService.baseAddress;
    this.notificationSnackBarComponent = new NotificationSnackBarComponent(this.snackBar);
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> | any {
    const retrievedObject = localStorage.getItem('authorizationData');
    if (retrievedObject) {
      const authenticationDetails = JSON.parse(retrievedObject) as AuthenticationDetails;
      if (authenticationDetails) {
        const token: string = authenticationDetails.Token;
        if (token) {
          request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }
      }
    }

    if (!request.headers.has('Content-Type') && !request.url.includes('Attachment') && !request.url.includes("SaveDoc/DeleteData") && !request.url.includes("SignDoc/Upload")  && !request.url.includes("aadhar") && !request.url.includes('AutoSign/GetSignedForDocument') && !request.url.includes("GenerateRequestXml/aadhar")&&!request.url.includes('SaveDashboardCards') && !request.url.includes('AddDocument') && !request.url.includes('AddDocH') && !request.url.includes('AddDocApp') && !request.url.includes('AddDocAtt')&& !request.url.includes('UpdateDoc')&& !request.url.includes('UpdateAttachment')&& !request.url.includes('UpdateDocument')&& !request.url.includes('GetDocumentSigned')&& !request.url.includes('DeleteRef')&& !request.url.includes('PdfSignImg')&& !request.url.includes('ipify') && !request.url.includes('SendConfirmedEmail') && !request.url.includes("SendRemainderController1") && !request.url.includes("SendRemainderEmail")&&!request.url.includes("SignDoc/Upload")  && !request.url.includes("aadhar") && !request.url.includes('AutoSign/GetSignedForDocument') && !request.url.includes("GenerateRequestXml/aadhar")&&!request.url.includes('SaveDashboardCards') && !request.url.includes('AddDocument') && !request.url.includes('AddDocH') && !request.url.includes('AddDocApp') && !request.url.includes('AddDocAtt')&& !request.url.includes('UpdateDoc')&& !request.url.includes('UpdateAttachment')&& !request.url.includes('UpdateDocument')&& !request.url.includes('GetDocumentSigned')&& !request.url.includes('DeleteRef')&& !request.url.includes('PdfSignImg')&& !request.url.includes('ipify') && !request.url.includes('SendConfirmedEmail') && !request.url.includes('SignPosition/GetPDFImage')  ) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('event--->>>', event);
          // this.errorDialogService.openDialog(event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
