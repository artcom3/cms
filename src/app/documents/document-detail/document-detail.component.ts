import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  nativeWindow: any;

  constructor(private documentService: DocumentService,
              private windowRefService: WindRefService,
              private router: Router,
              private route: ActivatedRoute) {
    this.nativeWindow = windowRefService.getNativeWindow();
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          const id = params['id'];
          this.document = this.documentService.getDocument(id);
        }
      )
  }

  onView() {
    if (this.document.url) {
      this.nativeWindow.open(this.document.url)
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }

}
