import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CoinApiService} from "../../services/api/coin-api.service";
import {ChartConfiguration, ChartDataset, ChartOptions, ChartType} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {CurrencyService} from "../../services/currency/currency.service";

@Component({
  selector: 'crypto-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.scss']
})
export class CoinDetailComponent implements OnInit {

   coinId!: string;
   coinData!:any;
   coinDays:number=30;
   coinCurrency:string='INR';

  public lineChartData: ChartConfiguration['data']={
    datasets:[
      {
        data:[],
        label:"Price Trends",
        backgroundColor:"rgba(148,159,177,0.8)",
        borderColor: '#009688',
        pointBackgroundColor: '#009688',
        pointBorderColor: '#009688',
        pointHoverBackgroundColor: '#009688',
        pointHoverBorderColor: '#009688',
      }
    ],
    labels:[]
  }

  public lineChartOptions:ChartConfiguration['options']={
    elements:{
      point:{
        radius:1
      }
    },
    plugins:{
      legend:{
        display:true
      }
    }
  };

  public lineChartType:ChartType="line";
  @ViewChild(BaseChartDirective) chartLine  !: BaseChartDirective;

  constructor(
    private activatedRoute:ActivatedRoute,
    private coinApiService:CoinApiService,
    private currencyService:CurrencyService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next:(data)=>{
        this.coinId=data['coin_id'];
      }
    });

    // load all currency data based on given id
    this.getCoinData();
    this.getCoinDataByGraphicalWay();

    this.currencyService.getCurrency().subscribe({
      next:(resp)=>{
        this.coinCurrency=resp;
        this.getCoinDataByGraphicalWay();
        this.getCoinData();
      }
    })
  }

  getCoinData(){
    this.coinApiService.getCurrencyDataById(this.coinId).subscribe({
      next:(resp)=>{
        if(this.coinCurrency==='USD'){
          resp.market_data.current_price.inr= resp?.market_data.current_price.usd;
          resp.market_data.market_cap.inr = resp?.market_data?.market_cap.usd;
        }
        else {
          resp.market_data.current_price.inr= resp?.market_data.current_price.inr;
          resp.market_data.market_cap.inr = resp?.market_data?.market_cap.inr;
        }
        this.coinData= resp;
      }
    })
  }


  public getCoinDataByGraphicalWay(days:number=24) {
    this.coinDays=days;

    this.coinApiService.getCurrencyDataInGraphicallyFormat(this.coinId,this.coinCurrency, this.coinDays)
      .subscribe({
        next:(resp)=>{

          setTimeout(() => {
            this.chartLine?.update();
          }, 400);
           // console.log(resp);
          this.lineChartData.datasets[0].data= resp.prices.map((price:any)=>price[1]);

          this.lineChartData.labels= resp.prices.map((price:any)=>{
            let date = new Date(price[0]);
             let time =  date.getHours() > 12 ? `${date.getHours()-12}:${date.getMinutes()} PM`
                    :
                    `${date.getHours()}: ${date.getMinutes()} AM`;
              return this.coinDays===1 ? time : date.toLocaleDateString();
          });
        }
      })
  }


}
