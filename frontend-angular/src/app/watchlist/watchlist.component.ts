import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  public stocks:Array<any> []
  public helperticker: any = 'ticker'
  public helpername: any = 'name'
  public helperprice: any = 'latestprice'
  public helperchange: any = 'change'
  public helperpercent: any = 'percentchange'
  public watchlist_stocks:Array<any> = []
  public arr:Array<any> = []
  constructor() { 
    
  }
  ngOnInit(): void {
    this.stocks = JSON.parse(localStorage.getItem('watchlist')|| '{}');
    for (let i in this.stocks){
      this.arr = []
      this.arr.push(this.stocks[i][this.helperticker])
      this.arr.push(this.stocks[i][this.helpername])
      this.arr.push(this.stocks[i][this.helperprice])
      this.arr.push(this.stocks[i][this.helperchange])
      this.arr.push(this.stocks[i][this.helperpercent])
      this.watchlist_stocks.push(this.arr)
    }
  }

  closefromWL(company){
    let wl = JSON.parse(localStorage.getItem('watchlist'));
    localStorage.removeItem('watchlist');
    delete wl[company];
    localStorage.setItem('watchlist', JSON.stringify(wl));
		this.pageRefresh();
  }

  pageRefresh(){
    this.watchlist_stocks = []
    this.stocks = JSON.parse(localStorage.getItem('watchlist')|| '{}');
  
    for (let i in this.stocks){
      this.arr = []
      this.arr.push(this.stocks[i][this.helperticker])
      this.arr.push(this.stocks[i][this.helpername])
      this.arr.push(this.stocks[i][this.helperprice])
      this.arr.push(this.stocks[i][this.helperchange])
      this.watchlist_stocks.push(this.arr)
  }
}
}
