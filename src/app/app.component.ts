import { Component } from '@angular/core';
import {CurrencyService} from "./services/currency/currency.service";

@Component({
  selector: 'crypto-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public selectedLanguage: string='INR';

   constructor(private currencyService:CurrencyService) {}

  sendCurrency(event: any) {
    console.log(event)
    this.currencyService.setCurrency(event);
  }



}
