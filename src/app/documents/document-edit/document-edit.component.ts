import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) { 

  }
  
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        if (!id) {
          this.editMode = false;
          return;
        }

        this.originalDocument = this.documentService.getDocument(id);

        if (!this.originalDocument) {
          return
        }
        this.editMode = true;
        this.document = JSON.parse(JSON.stringify(this.originalDocument));
      }
    )
  }
  
  onCancel() {
    this.router.navigate(['/documents']);
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    //console.log(value);
    const newDocument = new Document(
      null, value.title,value.description, value.url,  null
    );
    //console.log(newDocument)
    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents']);
  }
}
