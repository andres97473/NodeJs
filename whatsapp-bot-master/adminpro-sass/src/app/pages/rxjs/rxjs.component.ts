import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [],
})
export class RxjsComponent implements OnDestroy {
  public intervalSubs?: Subscription;

  constructor() {
    // this.retornaObservable()
    //   .pipe(retry())
    //   .subscribe(
    //     (valor) => console.log('Subs: ', valor),
    //     (err) => console.warn('Error:', err),
    //     () => console.info('Obs Terminado')
    //   );

    this.intervalSubs = this.retornaIntervalo().subscribe(console.log);
  }

  ngOnDestroy(): void {
    this.intervalSubs?.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {
    const intervalo$ = interval(500).pipe(
      // take(10),
      map((valor) => valor + 1),
      filter((valor) => (valor % 2 === 0 ? true : false))
    );

    return intervalo$;
  }

  retornaObservable(): Observable<number> {
    let i = -1;
    return new Observable<number>((observer) => {
      const intervalo = setInterval(() => {
        // console.log('tick');
        i++;
        observer.next(i);
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }
        if (i === 2) {
          console.log('i=2.....Error');

          observer.error('I llego al valor de 2');
        }
      }, 1000);
    });
  }
}
