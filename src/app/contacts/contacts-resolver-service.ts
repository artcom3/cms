import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { Contact } from "./contact.model";
import { ContactService } from "./contact.service";

@Injectable({
    providedIn: 'root'
})
export class ContactsResolverService implements Resolve<Contact[]> {
    constructor(private contactService: ContactService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Contact[] | Observable<Contact[]> | Promise<Contact[]> {
        return this.contactService.getContacts();   
    }
}
    