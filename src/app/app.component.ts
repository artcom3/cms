import { Component } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedFeature: string = "documents";
  title = 'cms';

  constructor() { }

  ngOnInit(): void {
  }

  switchView(selectedFeature: string) {
    this.selectedFeature = selectedFeature;
  }

}
