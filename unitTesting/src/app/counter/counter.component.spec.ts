import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from "@angular/core";
import { By } from '@angular/platform-browser'; 

import { CounterComponent } from './counter.component';
import { debug } from 'util';

describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>; // refrence naar component. 
  let debugElement: DebugElement; 
  let htmlElement: HTMLElement; 


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CounterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.css('p'));
    htmlElement = debugElement.nativeElement;
  }); 

   it('zou nummer: 1 moeten laten zien', () => {  
     expect(htmlElement.textContent).toEqual('Number: 1');
   })

   it('tel er 1 bij op', () =>  {
    const initialValue = component.counter

    // dingen doen
    component.omhoog();
    fixture.detectChanges();
    const newValue = component.counter;

    // check
    expect(newValue).toBeGreaterThan(initialValue);

   });

  //  it('haal er 1 van af', () => {
  //   const initialValue = component.counter 

  //   // dingen doen 
  //   component.omlaag();
  //   fixture.detectChanges();
  //   const newValue = component.counter;

  //   // check

  //   expect(newValue).toBeLessThan(initialValue);

  //  });

  }); 