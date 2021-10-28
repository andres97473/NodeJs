import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { Technology } from '../../models/technology.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  technologies: Technology[] = [];
  query: string | undefined;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _httpService: HttpService
  ) {}

  ngOnInit(): void {
    this._activatedRoute.params.subscribe((params) => {
      this.query = params['query'];

      this._httpService
        .searchTechnology(this.query as any)
        .subscribe((technologies: Technology[] | any) => {
          this.technologies = technologies['data'];
        });
    });
  }
}
