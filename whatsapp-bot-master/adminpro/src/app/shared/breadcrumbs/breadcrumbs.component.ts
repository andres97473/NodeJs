import { Component } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [],
})
export class BreadcrumbsComponent {
  public titulo = '';

  constructor(private router: Router) {
    this.getArgumentosRuta();
  }

  getArgumentosRuta() {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )
      .subscribe(({ titulo }) => {
        // console.log(data);
        this.titulo = titulo;
        // poner tirulo en el navegador
        document.title = `AdminPro - ${titulo}`;
      });
  }
}
