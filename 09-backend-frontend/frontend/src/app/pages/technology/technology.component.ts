import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Technology } from '../../models/technology.model';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.css'],
})
export class TechnologyComponent implements OnInit {
  public technology: Technology = {
    name: '',
    description: '',
    logo: '',
    _id: '',
    tags: [],
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _httpService: HttpService
  ) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      this._httpService
        .getTechnology(id)
        .subscribe((technology: Technology | any) => {
          this.technology = technology['data'];
        });
    });
  }
}
