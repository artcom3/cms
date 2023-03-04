import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
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

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  };

  getDocuments(): Document[] {
    return this.documents.slice()
  };

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
    this.documentListChangedEvent.next(documentsListClone);
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
    this.documentListChangedEvent.next(documentsListClone);
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
    this.documentListChangedEvent.next(documentsListClone);
  }; 
}
