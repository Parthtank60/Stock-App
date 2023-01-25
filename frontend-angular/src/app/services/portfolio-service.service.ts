import { Injectable } from '@angular/core';
import {WalletService} from '../services/wallet.service'

@Injectable({
  providedIn: 'root'
})
export class PortfolioServiceService {

  constructor(private walletservice: WalletService) { }

  getPurchases(){
    let purchases = localStorage.getItem('watchlist')
    let purchasesarray
    if (purchases){
      purchasesarray = JSON.parse(purchases)
      return purchasesarray
    }
    else{
      return []
    }
}
  buyStock(ticker:string,name:string, latestprice: number, quantity: number){
    let purchases = localStorage.getItem('purchases')
    let purchasesarray
    let walletamount = Number(this.walletservice.getWallet())
    // walletamount = JSON.parse(walletamount)
    if (purchases){
      purchasesarray = JSON.parse(purchases)
      if (ticker in purchasesarray){
          let stock = purchasesarray[ticker]
          stock.Quantity = stock.Quantity + quantity
          stock.Totalcost = stock.Totalcost + latestprice*quantity
          stock.Avgprice = stock.Totalcost / stock.Quantity
          stock.Latestprice = latestprice
          stock.Sname = name
          purchasesarray[ticker] = stock
          walletamount = walletamount - (latestprice*quantity)
          
      }
      else{
        let avgp = latestprice*quantity / quantity
        let stock = {Sname:name, Quantity:quantity, Latestprice:latestprice, Totalcost: quantity*latestprice, Avgprice: avgp}
        purchasesarray[ticker] = stock
        walletamount = walletamount - (latestprice*quantity)
      }
    }
    else{
      purchasesarray = {
        [ticker]: {
          Sname: name,
          Quantity: quantity,
          Latestprice: latestprice,
          Totalcost: quantity*latestprice,
          Avgprice: latestprice*quantity / quantity,
        },
      };
      walletamount = walletamount - (latestprice*quantity)

    }
    localStorage.setItem('purchases', JSON.stringify(purchasesarray))
    localStorage.setItem('wallet',JSON.stringify(walletamount))
  }


  sellStock(ticker: string, name: string, latestprice: number, quantity: number){
    let purchases = localStorage.getItem('purchases')
    let purchasesarray = JSON.parse(purchases)
    let walletamount = Number(this.walletservice.getWallet())
    let stock = purchasesarray[ticker]
    stock.Quantity = stock.Quantity - quantity
    stock.Totalcost = stock.Totalcost - latestprice*quantity
    stock.Avgprice = stock.Totalcost / stock.Quantity
    stock.Latestprice = latestprice
    stock.Sname = name
    purchasesarray[ticker] = stock
    walletamount = walletamount + (latestprice*quantity)

    if (stock.Quantity === 0){
      delete purchasesarray[ticker]
    }
  
  localStorage.setItem('purchases', JSON.stringify(purchasesarray))
  localStorage.setItem('wallet',JSON.stringify(walletamount))
  }
}
