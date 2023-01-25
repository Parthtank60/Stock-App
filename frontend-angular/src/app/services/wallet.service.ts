import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor() { }

  getWallet(){
    let amount = localStorage.getItem('wallet')
    if(amount){
      amount = JSON.parse(amount)
      return amount
      
    }
    else{
      let money = 25000
      localStorage.setItem('wallet',JSON.stringify(money))
      return money
    }
  }
}
