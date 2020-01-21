import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  counter: number
  
  constructor() {
    this.counter = 1;
  }
  omhoog() {
    this.counter++;
  }

  omlaag() {
    this.counter--;
  }
}
