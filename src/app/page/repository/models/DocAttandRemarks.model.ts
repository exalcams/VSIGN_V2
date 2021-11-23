
import { DocAtt } from '../../outbox/models/DocAtt.model';
import { DocAppLog } from './AppLog.model';
// import { DocAtt } from '/outbox/DocAtt.model';

export class DocAttanRemarks{
    doc:DocAtt[];
    docRemarks:string;
     signSelf :string;

         signCert :string;
        
         signAadhar :string;

         signToken :string;

         signImg :string;
         signCursor:string;
         signTag:string;
         logDatas:DocAppLog[];
}