import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CoinApiService} from "../../services/api/coin-api.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";
import {CurrencyService} from "../../services/currency/currency.service";

@Component({
  selector: 'crypto-coin-list',
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.scss']
})
export class CoinListComponent implements OnInit {
  selectedCurrency: string="INR";
  trendingList: any[]= [];
  displayedColumns: string[] = ['symbol', 'name','current_price','price_change_percentage_24h','market_cap'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private coinApiService:CoinApiService,
    private currencyService:CurrencyService,
    private router:Router
  ) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getAllData();
    this.getTrendingData();
    this.getSelectedCurrency();
  }

  getTrendingData(){
    this.coinApiService.getTrendingCurrencyData(this.selectedCurrency)
      .subscribe({
        next:(resp)=>{
          console.log(resp);
          this.trendingList=resp;
        },
        error:()=>{}
      })
  }

  getAllData(){
    this.coinApiService.getCurrencies(this.selectedCurrency)
      .subscribe({
        next:(resp)=>{

          this.dataSource = new MatTableDataSource(resp);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error:()=>{}
      })
  }

  goToRow(row:any) {
    this.router.navigate(['coin-detail',row.id])
  }

  private getSelectedCurrency() {
    this.currencyService.getCurrency().subscribe({
      next:(resp)=>{
        console.log("selectedCurrency", this.selectedCurrency)
        this.selectedCurrency=resp;
      }
    })
  }
}
