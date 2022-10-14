import {
  AfterContentInit,
  Component,
  DoCheck,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements AfterContentInit {
  time = 10;

  constructor() {}

  click() {
    console.log('click');
    this.time = 10;
  }

  ngAfterContentInit(): void {
    this.myTimer();
  }

  myTimer() {
    setInterval(() => {
      this.time = this.time - 1;
      console.log('tick ', this.time);
    }, 1000);
  }
}
