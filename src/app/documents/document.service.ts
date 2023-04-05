import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, EventEmitter } from '@angular/core';
import { Subject, tap, map } from 'rxjs';
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
    // this.getDocuments();
    // this.maxDocumentId = this.getMaxId();
  };

  getDocuments() {
    return this.http
    .get('http://localhost:3000/documents')
    .pipe(
      map(response => {
        console.log(response['message']);
        return response['documents'];
      }),
      tap({
        next: (documents: Document[]) => {
          this.documents = documents;
          this.sortAndSend();
          // this.maxDocumentId = this.getMaxId();
          // documents.sort((a, b) => parseInt(a.id) - parseInt(b.id));
          // this.documentListChangedEvent.next(documents.slice())
        },
        error: (error:any) => (console.log(error))
      })
    );
  };

  // storeDocuments(documents: Document[]) {
  //   const updatedDocuments = JSON.stringify(documents);

  //   this.http
  //     .put(
  //       'https://khcms-8c149-default-rtdb.firebaseio.com/documents.json',
  //       updatedDocuments,
  //       { 
  //         headers: new HttpHeaders({ 'Content-Type': 'application/json' }) 
  //       })
  //     .subscribe({
  //       next: () => {
  //         this.documentListChangedEvent.next(documents.slice())
  //       },
  //       error: (error:any) => (console.log(error))
  //     });
  // }

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

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
    // if (!document) {
    //   return;
    // }
    // const pos = this.documents.indexOf(document);
    // if (pos < 0) {
    //   return;
    // }
    // this.documents.splice(pos, 1);
    // const documentsListClone = this.documents.slice()
    // this.storeDocuments(documentsListClone);
  };

  // getMaxId() {
  //   let maxId = 0;
  //   this.documents.forEach((document) => {
  //     const currentId = parseInt(document.id)
  //     if (currentId > maxId)
  //       maxId = currentId;
  //   })
  //   return maxId;
  // };


  sortAndSend(){
    this.documents.sort((a,b) => {
      return a.name.localeCompare(b.name, undefined, {sensitivity: 'base'})
    });
    console.log(this.documents);
    this.documentListChangedEvent.next(this.documents.slice())
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );

    // this.maxDocumentId++;
    // newDocument.id = this.maxDocumentId.toString();
    // this.documents.push(newDocument);
    // const documentsListClone = this.documents.slice();
    // this.storeDocuments(documentsListClone);
  };

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }; 
}
