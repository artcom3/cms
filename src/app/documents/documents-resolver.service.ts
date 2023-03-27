import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Document } from "./document.model";
import { DocumentService } from "./document.service";

@Injectable({
    providedIn: 'root'
})
export class DocumentsResolverService implements Resolve<Document[]> {
    constructor(private documentService: DocumentService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Document[] | Observable<Document[]> | Promise<Document[]> {
        return this.documentService.getDocuments();   
    }
}
    