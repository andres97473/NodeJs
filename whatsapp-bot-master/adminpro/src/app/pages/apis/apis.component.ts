import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apis',
  templateUrl: './apis.component.html',
  styles: [],
})
export class ApisComponent implements OnInit {
  public url = window.location;

  constructor() {}

  ngOnInit(): void {
    // console.log(this.url);
  }
}
