import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CoinApiService {

  constructor(
    private http:HttpClient
  ) { }

  getCurrencies(currency:string):Observable<any>{
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&sparkline=false`)
  }

  getCurrencyDataById(coinId:string):Observable<any>{
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/${coinId}`)
  }

  getTrendingCurrencyData(currency:string):Observable<any>{
    return  this.http.get<any>(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`)
  }

  getCurrencyDataInGraphicallyFormat(coinId:string,currency:string,days:number){
    return this.http.get<any>(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`)
  }


}
