import { Component, Input, OnInit } from '@angular/core';
import {portfolio} from '../portfolio'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WalletService } from '../services/wallet.service';
import { PortfolioServiceService } from '../services/portfolio-service.service'



@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  
  stocks: any [];
  @Input() walletamount;
  quantity;
  maxsellqnt;
  constructor(private modalService: NgbModal, private walletservice: WalletService, private portfolioservice: PortfolioServiceService) { 

  }


  ngOnInit(): void {
    this.walletamount = Number(this.walletservice.getWallet())
    this.stocks = JSON.parse(localStorage.getItem('purchases')|| '{}');
  }

  openModal(content) {
    this.modalService.open(content, {
      ariaLabelledBy: 'Buy Stock',
    });
    this.walletamount = this.walletservice.getWallet()
    console.log(this.walletservice.getWallet())
  }

  openSellModal(content,ticker) {
    this.maxsellqnt = JSON.parse(localStorage.getItem('purchases'))[ticker].Quantity
    this.modalService.open(content, {
      ariaLabelledBy: 'Buy Stock',
    });
    this.walletamount = this.walletservice.getWallet()
    console.log(this.walletservice.getWallet())
  }

  closeModal(ticker){
    console.log(ticker)
    console.log(this.stocks[ticker]['Latestprice'])
    this.modalService.dismissAll();
    // this.addAlert({
    //   type: 'success',
    //   message: this.highlights.ticker + ' bought successfully!',
    // });
    this.portfolioservice.buyStock(
      ticker,
      this.stocks[ticker]['Sname'],
      this.stocks[ticker]['Latestprice'],
      this.quantity,
    );
    this.quantity = 0;
    this.ngOnInit()
  }


  closesellModal(ticker){
    console.log(ticker)
    console.log(this.stocks[ticker]['Latestprice'])
    this.modalService.dismissAll();
    // this.addAlert({
    //   type: 'success',
    //   message: this.highlights.ticker + ' bought successfully!',
    // });
    this.portfolioservice.sellStock(
      ticker,
      this.stocks[ticker]['Sname'],
      this.stocks[ticker]['Latestprice'],
      this.quantity,
    );
    this.quantity = 0;
    this.ngOnInit()
  }


}
