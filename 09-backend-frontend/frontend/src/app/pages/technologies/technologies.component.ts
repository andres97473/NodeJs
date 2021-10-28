import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Technology } from '../../models/technology.model';

@Component({
  selector: 'app-technologies',
  templateUrl: './technologies.component.html',
  styleUrls: ['./technologies.component.css'],
})
export class TechnologiesComponent implements OnInit {
  public technologies: Technology[] = [];
  constructor(public _httpService: HttpService) {}

  ngOnInit(): void {
    this._httpService
      .getTechnologies()
      .subscribe((technologies: Technology[] | any) => {
        this.technologies = technologies['data'];
      });
  }
}
