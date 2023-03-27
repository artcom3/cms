import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, EventEmitter } from '@angular/core';
import { Subject, tap } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  maxDocumentId = 0;
  private documents: Document[] = [];
  // documentSelectedEvent = new EventEmitter<Document>();
  // documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {
    // this.documents = MOCKDOCUMENTS;
    this.getDocuments();
    this.maxDocumentId = this.getMaxId();
  };

  getDocuments() {
    return this.http
    .get('https://khcms-8c149-default-rtdb.firebaseio.com/documents.json')
    .pipe(
      tap({
        next: (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          documents.sort((a, b) => parseInt(a.id) - parseInt(b.id));
          this.documentListChangedEvent.next(documents.slice())
        },
        error: (error:any) => (console.log(error))
      })
    );
  };

  storeDocuments(documents: Document[]) {
    const updatedDocuments = JSON.stringify(documents);

    this.http
      .put(
        'https://khcms-8c149-default-rtdb.firebaseio.com/documents.json',
        updatedDocuments,
        { 
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
        })
      .subscribe({
        next: () => {
          this.documentListChangedEvent.next(documents.slice())
        },
        error: (error:any) => (console.log(error))
      });
  }

  getDocument(id: string): Document {
    let returnedDocument = null;
    this.documents.forEach(document => {
      if (document.id == id)
        returnedDocument = document;
    });
    return returnedDocument;
  };

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    const documentsListClone = this.documents.slice()
    this.storeDocuments(documentsListClone);
  };

  getMaxId() {
    let maxId = 0;
    this.documents.forEach((document) => {
      const currentId = parseInt(document.id)
      if (currentId > maxId)
        maxId = currentId;
    })
    return maxId;
  };

  addDocument(newDocument: Document) {
    if (!document) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    const documentsListClone = this.documents.slice();
    this.storeDocuments(documentsListClone);
  };

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument)
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    const documentsListClone = this.documents.slice();
    this.storeDocuments(documentsListClone);
  }; 
}
