declare var require: any;
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppServiceService } from '../app-service.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioServiceService } from '../services/portfolio-service.service'
import { WalletService } from '../services/wallet.service'
import * as moment from 'moment';
import 'moment-timezone';
import * as Highcharts from 'highcharts/highstock';
require('highcharts/indicators/indicators')(Highcharts);
import { Options } from 'highcharts/highstock';
require('highcharts/indicators/volume-by-price')(Highcharts);
import IndicatorsCore from "highcharts/indicators/indicators";
import IndicatorVBP from "highcharts/indicators/volume-by-price";
IndicatorsCore(Highcharts);
IndicatorVBP(Highcharts);

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounce, debounceTime, finalize, switchMap, tap } from 'rxjs';
import { Recommendation } from '../recommendation';
import { Router } from '@angular/router';





function getLATimezone(timestamp: any) {
  var zone = 'America/Los_Angeles',
    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
  return timezoneOffset;
}


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})


export class DetailsComponent implements OnInit {
  public summaryisVisible = true;
  public newsisVisible = true;
  public chartsisVisible = true;
  public insightsisVisible = true;
  public name:string ='';
  isTickerValid= true;
  public input_ticker: string;
  public company_details = {};
  public Company_LatestPrice = {};
  public tot_mention_twi:number=0;
  public pos_mention_twi:number=0;
  public neg_mention_twi:number=0;
  public tot_mention_red:number=0;
  public pos_mention_red:number=0;
  public neg_mention_red:number=0;
  isInWL= false;
  isInPr = false;
  closeResult= '';
  quantity = 0;
  peers: string [] = [];
  @Input() public walletamount;
  hourlyPrices:any;
  insights_data:any
  isHighCharts:Boolean = true;
  newsArticles = new Array();
  historicalPrices:any;
  data_loaded:boolean=false;
  ohlcCHarts!:Highcharts.Options;
  Highcharts: typeof Highcharts = Highcharts;
  hourlyChartOptions:  Highcharts.Options;
  recommendationChart: Highcharts.Options;
  earningsChart: Highcharts.Options;
  chartsConstructor = 'stockChart'
  chartLineColor:string='';
  TrendChartOptions:Highcharts.Options;
  maxsellqnt;
  companyRecommendations:any;
  companyEarnings:any=[];


  //serachcomponent
  recommendations:any = [];
  resultantCompanies: Recommendation[] = []
  search_text:string ="";
  recommendationLoading=false;
  searchField!: FormGroup;
  text:string="";
  ifblock = false;
  public inputname:string ='';
  public isVisible =  false

  openSm(content: any) {
    // console.log(i)
    console.log(content)
    this.modalService.open(content, { size: 'md' });
  }
  
  constructor(private router: Router,private route: ActivatedRoute,private service : AppServiceService,private modalService: NgbModal, private portfolioservice: PortfolioServiceService, private walletservice:  WalletService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    //searchcomponent
    this.searchField = this.formBuilder.group({textInput: ''})
    this.searchField.get('textInput')?.valueChanges.pipe(
      debounceTime(300),
      tap(()=>(this.recommendationLoading = true)),
      switchMap((value) =>
      this.service.getAutoCompleteText(value).pipe(finalize(()=>(this.recommendationLoading = false)))
      )
    )
    .subscribe((tickers) => this.recommendations = tickers)


    console.log(this.service.searchdone)
    this.input_ticker = this.route.snapshot.paramMap.get('ticker').toUpperCase();
    console.log(this.input_ticker)

    this.service.getCompany(this.input_ticker).subscribe((response)=>{
        if (Object.keys(response).length === 0){
          this.isTickerValid = false;
          console.log('empty')
        }
        else{
          this.company_details['ticker'] = response['ticker']
          this.company_details['name'] = response['name']
          this.company_details['logo'] = response['logo']
          this.company_details['exchangecode'] = response['exchange']
          this.company_details['ipo'] = response['ipo']
          this.company_details['weburl'] = response['weburl']
          this.company_details['industry'] = response['finnhubIndustry']
          console.log('not empty')

          this.service.getLatestPrice(this.input_ticker).subscribe((response)=>{
            this.Company_LatestPrice['currentPrice'] = response['c']
            this.Company_LatestPrice['change'] = response['d']
            this.Company_LatestPrice['percentageChange'] = response['dp']
            this.Company_LatestPrice['highprice'] = response['h']
            this.Company_LatestPrice['lowprice'] = response['l']
            this.Company_LatestPrice['openprice'] = response['o']
            this.Company_LatestPrice['previousclose'] = response['pc']
            this.Company_LatestPrice['timestamp'] = response['t']
          })
          // console.log(this.Company_LatestPrice)
          this.isTickerValid = true;
          if(this.Company_LatestPrice['change']> 0){
            this.chartLineColor = '#008000'
          }
          else{
            this.chartLineColor = '#FF0000'
          }


          this.service.getCompanyPeers(this.input_ticker).subscribe((response) => {
            // console.log(response)
            this.peers = response
          })

          this.service.getHourlyData(this.input_ticker).subscribe((prices)=>{
            // console.log(prices)
            this.hourlyPrices = prices
            this.createHourlyCharts()
          })

          this.service.getCompanyNewsDetails(this.input_ticker).subscribe((articles)=>{
            console.log(articles)
            console.log(Object.keys(articles).length)
            // console.log(articles[0].category)
            // this.newsArticles = articles.slice(0,20)
            let l = Math.min(20,Object.keys(articles).length)
            this.newsArticles = []
            for( var i=0; i<l; i++){
              this.newsArticles.push(articles[i])
            }
            console.log(this.newsArticles)
          })

          this.service.getHistoricalData(this.input_ticker).subscribe((response)=>{
            console.log(response)
            this.historicalPrices = response
            this.createHistoricalCharts()
            this.data_loaded=true
          })

          this.service.getInsights(this.input_ticker).subscribe((insights)=>{
            // console.log(insights)
            this.insights_data=insights
            console.log(this.insights_data) 
            for(var i=0;i<this.insights_data[1]['reddit'].length;i++){
              this.tot_mention_red=this.tot_mention_red+this.insights_data[1]['reddit'][i]['mention'];
              this.pos_mention_red=this.pos_mention_red+this.insights_data[1]['reddit'][i]['positiveMention'];
              this.neg_mention_red=this.neg_mention_red+this.insights_data[1]['reddit'][i]['negativeMention'];
              this.tot_mention_twi=this.tot_mention_twi+this.insights_data[1]['twitter'][i]['mention'];
              this.pos_mention_twi=this.pos_mention_twi+this.insights_data[1]['twitter'][i]['positiveMention'];
              this.neg_mention_twi=this.neg_mention_twi+this.insights_data[1]['twitter'][i]['negativeMention'];
            }
            // this.create_stacked_charts()
            // this.createRecommendationCharts()
          })

          // console.log('I am from recommendation cahrt outside')
          this.service.getCompanyRecommendations(this.input_ticker).subscribe((response)=>{
            // console.log('I am from recommendation cahrt')
            console.log(response)
            this.companyRecommendations =response
            this.createRecommendationCharts()
          })
          // console.log('I am from recommendation cahrt outside over')
          this.service.getCompanyEarnings(this.input_ticker).subscribe((response)=>{
            console.log(response)
            this.companyEarnings = response
            console.log(this.companyEarnings[0]['period'])
            this.createEarningsChart()
    ​
          })

          this.handlingSummary();
          this.service.searchdone = true;
        }

    })
   
  }

  myRecommendation = new FormControl();
  getRecommendedSymbol(){
    this.service.getAutoCompleteText(this.search_text).subscribe((Response)=>{
      console.log(Response)
    }
    )
  }

  getDatafromAPI(tname:string){
    console.log('i am in getdata')
    this.service.getCompany(tname).subscribe((response) => {
      console.log('res ',response)

    },(error)=>{
      console.log('i am in error')
      console.log('error',error)
    })
  }

  eraseInput(){
    this.name = '';
  }

  onSubmit(tickerData:any) {
    if(tickerData.textInput.symbol){
      console.log("I am in first if ")
      this.ifblock = false
      this.updateData(tickerData.textInput.symbol.toUpperCase()).then(_ =>{
        this.router.navigate(['/search',tickerData.textInput.symbol])
      })
    }
    else{
      if (tickerData.textInput === ''){
        console.log('hahaha')
        this.ifblock = true
      }
      else{
        console.log('direct enter',tickerData.textInput)
        this.ifblock = false
        this.updateData(tickerData.textInput.toUpperCase()).then(_ =>{
          console.log('now I am redirecting', this.isTickerValid)
          this.router.navigate(['/search',tickerData.textInput])
        })
      }
    }
    
  }
  onSubmitClick(tickerData:any) {
    console.log(tickerData.textInput)
    console.log('ticker name in form: ', tickerData);
    this.updateData(tickerData.textInput.toUpperCase()).then(_ =>{
      this.router.navigate(['/search',tickerData.textInput])
    })
  }

  displayTicker(company: Recommendation) {
    if (company) {
      return company.displaySymbol;
    }
    return ""
  }

  // // // // //



  createRecommendationCharts(){
    this.recommendationChart ={
      chart: {
        type: 'column'
    },
    colors:['#730202','#CC1D28','#DB7E04','#04CF1C','#01750F' ],
    title: {
      text: 'Recommendation trends'
  },
  xAxis: {
    categories: ['2021-12-01', '2022-01-01', '2022-02-01', '2022-03-01']
  },
  yAxis: {
    min: 0,
    title: {
        text: 'Total fruit consumption'
    },
    stackLabels: {
        enabled: true,
        style: {
            fontWeight: 'bold',
        }
    }
  },
  legend: {
    align: 'right',
    x: -30,
    verticalAlign: 'top',
    y: 25,
    floating: true,
    backgroundColor:'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
  },
  plotOptions: {
    column: {
        stacking: 'normal',
        dataLabels: {
            enabled: true
        }
    }
  },
  series:[{
    type:'column',
    name: 'StrongSell',
    data:this.companyRecommendations.strongBuy
  },
  {
    type:'column',
    name: 'Sell',
    data:this.companyRecommendations.sell
  },
  {
    type:'column',
    name: 'Hold',
    data:this.companyRecommendations.hold
  },
  {
    type:'column',
    name: 'Buy',
    data:this.companyRecommendations.buy
  },
  {
    type:'column',
    name: 'StrongBuy',
    data:this.companyRecommendations.strongBuy
  },
  ]
    }
  }
​
createEarningsChart(){
  this.earningsChart={
    chart: {
      type: 'spline',
      // inverted: true
  },
  title: {
    text: 'Historical EPS Surprises'
},
xAxis: {
  reversed: false,
  maxPadding: 0.05,
  showLastLabel: true,
 categories: [this.companyEarnings[0]['period']+'<br>'+this.companyEarnings[0]['surprise'],
 this.companyEarnings[1]['period']+'<br>'+this.companyEarnings[1]['surprise'],
 this.companyEarnings[2]['period']+'<br>'+this.companyEarnings[2]['surprise'],
 this.companyEarnings[3]['period']+'<br>'+this.companyEarnings[3]['surprise']
]
},
yAxis: {
  min: 0,
  title: {
      text: 'Quarterly EPS'
  },
  lineWidth: 2
},
legend: {
  enabled: false
},
tooltip: {
  headerFormat: '<b>{point.x}</b><br/>',
  pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
},

series:[{
  type:'spline',
  name: 'Actual',
  data: [[this.companyEarnings[0]['period'],this.companyEarnings[0]['actual']],
  [this.companyEarnings[1]['period'],this.companyEarnings[1]['actual']],
  [this.companyEarnings[2]['period'],this.companyEarnings[2]['actual']],
  [this.companyEarnings[3]['period'],this.companyEarnings[3]['actual']]]
},
{
  type:'spline',
  name: 'Estimate',
  data: [[this.companyEarnings[0]['period'],this.companyEarnings[0]['estimate']],
  [this.companyEarnings[1]['period'],this.companyEarnings[1]['estimate']],
  [this.companyEarnings[2]['period'],this.companyEarnings[2]['estimate']],
  [this.companyEarnings[3]['period'],this.companyEarnings[3]['estimate']]]
},
]
  }
}

  createHourlyCharts(){
    let hourlyInstance = []
    let priceLength = this.hourlyPrices.c.length,i
    for (i=0; i<priceLength; i++){
      hourlyInstance.push([this.hourlyPrices.t[i]*1000,this.hourlyPrices.c[i]])
    }
    this.hourlyChartOptions = {
      series:[
        {
          data: hourlyInstance,
          name : this.input_ticker.toUpperCase() ,
          type: 'line',
          color:this.chartLineColor,
          tooltip:{
            valueDecimals:2,
          },
        },
      ],
      title: { text: this.input_ticker?.toUpperCase() + ' Hourly Price Variation' },
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: false
    },
      time: {
        getTimezoneOffset: getLATimezone,
      },
    }
  }

  createHistoricalCharts(){
    let ohlc_data = [],stock_volume= [],data_length = this.historicalPrices.t.length
    for(let i = 0;i<data_length;i++){
      ohlc_data.push([
        this.historicalPrices.t[i]*1000,
        this.historicalPrices.o[i],
        this.historicalPrices.h[i],
        this.historicalPrices.l[i],
        this.historicalPrices.c[i]
      ])
      stock_volume.push([
        this.historicalPrices.t[i]*1000,
        this.historicalPrices.v[i]
      ])
    }
    this.ohlcCHarts={
      series:[
        {
          type: 'candlestick',
          name: this.input_ticker!.toUpperCase(),
          id: this.input_ticker!,
          zIndex: 2,
          data: ohlc_data,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: stock_volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo!: this.input_ticker,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: this.input_ticker,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
      title: { text: this.input_ticker!.toUpperCase() + 'Historical' },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      yAxis:[
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 6,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      rangeSelector: {
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1m',
          },
          {
            type: 'month',
            count: 3,
            text: '3m',
          },
          {
            type: 'month',
            count: 6,
            text: '6m',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'year',
            count: 1,
            text: '1y',
          },
          {
            type: 'all',
            text:'All',
          },
        ],
        selected: 2,
      },
      time: {
        getTimezoneOffset: getLATimezone,
      }
    }
  }


  handlingSummary() {
		if (localStorage.getItem('watchlist') === null) { 
      this.isInWL = false;
		}
		else {
			let watchlist = JSON.parse(localStorage.getItem('watchlist'));
			if (this.input_ticker in watchlist) {	
        this.isInWL = true;
			}
			else {	
        this.isInWL = false;
			}
    }

    if(localStorage.getItem('purchases') === null){
      this.isInPr = false;
    }
    else{
      let purchase = JSON.parse(localStorage.getItem('purchases'));
      if (this.input_ticker in purchase){
        this.isInPr = true;
      }else{
        this.isInPr = false;
      }
    }
  
  
  }


  setOrRemoveFrmWl(ticker){
    if (localStorage.getItem('watchlist') === null) { 
			let watchlist = {};
			watchlist[ticker] = {'ticker': ticker, 'name': this.company_details['name'], 'latestprice': this.Company_LatestPrice['currentPrice'], 'change': this.Company_LatestPrice['change'],'percentchange': this.Company_LatestPrice['percentageChange']};
			localStorage.setItem('watchlist', JSON.stringify(watchlist));
      this.isInWL = true;
    }
    else{
    let wl = JSON.parse(localStorage.getItem('watchlist'));
    localStorage.removeItem('watchlist');
    if (ticker in wl){
      delete wl[ticker];
      this.isInWL = false;
      localStorage.setItem('watchlist', JSON.stringify(wl));
    }
    else{
      wl[ticker] = {'ticker': ticker, 'name': this.company_details['name'], 'latestprice': this.Company_LatestPrice['currentPrice'], 'change': this.Company_LatestPrice['change'],'percentchange': this.Company_LatestPrice['percentageChange']};
        this.isInWL = true;

        localStorage.setItem('watchlist', JSON.stringify(wl));
    }
  }
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
    console.log(this.maxsellqnt)
    
    this.modalService.open(content, {
      ariaLabelledBy: 'Sell Stock',
    });
    this.walletamount = this.walletservice.getWallet()
    console.log(this.walletservice.getWallet())
  }


  closeModal(){
    this.modalService.dismissAll();
    // this.addAlert({
    //   type: 'success',
    //   message: this.highlights.ticker + ' bought successfully!',
    // });
    this.portfolioservice.buyStock(
      this.input_ticker,
      this.company_details['name'],
      this.Company_LatestPrice['currentPrice'],
      this.quantity
    );
    this.quantity = 0;
    this.isInPr = true;
  }

  closesellModal(){
    this.modalService.dismissAll();
    // this.addAlert({
    //   type: 'success',
    //   message: this.highlights.ticker + ' bought successfully!',
    // });
    this.portfolioservice.sellStock(
      this.input_ticker,
      this.company_details['name'],
      this.Company_LatestPrice['currentPrice'],
      this.quantity
    );
    this.quantity = 0;
    this.handlingSummary();

  }


  async updateData(ticker){
    console.log('I am in update ',ticker)
    this.service.getCompany(ticker).subscribe((response)=>{
      if (Object.keys(response).length === 0){
        this.isTickerValid = false;
        console.log('empty')
      }
      else{
        this.company_details['ticker'] = response['ticker']
        this.company_details['name'] = response['name']
        this.company_details['logo'] = response['logo']
        this.company_details['exchangecode'] = response['exchange']
        this.company_details['ipo'] = response['ipo']
        this.company_details['weburl'] = response['weburl']
        this.company_details['industry'] = response['finnhubIndustry']
        console.log('not empty')

        this.service.getLatestPrice(ticker).subscribe((response)=>{
          this.Company_LatestPrice['currentPrice'] = response['c']
          this.Company_LatestPrice['change'] = response['d']
          this.Company_LatestPrice['percentageChange'] = response['dp']
          this.Company_LatestPrice['highprice'] = response['h']
          this.Company_LatestPrice['lowprice'] = response['l']
          this.Company_LatestPrice['openprice'] = response['o']
          this.Company_LatestPrice['previousclose'] = response['pc']
          this.Company_LatestPrice['timestamp'] = response['t']
        })
        // console.log(this.Company_LatestPrice)
        this.isTickerValid = true;
        if(this.Company_LatestPrice['change']> 0){
          this.chartLineColor = '#008000'
        }
        else{
          this.chartLineColor = '#FF0000'
        }


        this.service.getCompanyPeers(ticker).subscribe((response) => {
          // console.log(response)
          this.peers = response
        })

        this.service.getHourlyData(ticker).subscribe((prices)=>{
          // console.log(prices)
          this.hourlyPrices = prices
          this.createHourlyCharts1(ticker)
        })

        this.service.getCompanyNewsDetails(ticker).subscribe((articles)=>{
          console.log(articles)
          console.log(Object.keys(articles).length)
          // console.log(articles[0].category)
          // this.newsArticles = articles.slice(0,20)
          let l = Math.min(20,Object.keys(articles).length)
          this.newsArticles = []
          for( var i=0; i<l; i++){
            this.newsArticles.push(articles[i])
          }
          console.log(this.newsArticles)
        })

        this.service.getHistoricalData(ticker).subscribe((response)=>{
          console.log(response)
          this.historicalPrices = response
          this.createHistoricalCharts1(ticker)
          this.data_loaded=true
        })

        this.service.getCompanyRecommendations(ticker).subscribe((response)=>{
          // console.log('I am from recommendation cahrt')
          console.log(response)
          this.companyRecommendations =response
          this.createRecommendationCharts1()
        })

        this.service.getCompanyEarnings(ticker).subscribe((response)=>{
          console.log(response)
          this.companyEarnings = response
          console.log(this.companyEarnings[0]['period'])
          this.createEarningsChart1()
  ​
        })

        this.service.getInsights(ticker).subscribe((insights)=>{
          // console.log(insights)
          this.insights_data=insights
          console.log(this.insights_data) 
          for(var i=0;i<this.insights_data[1]['reddit'].length;i++){
            this.tot_mention_red=this.tot_mention_red+this.insights_data[1]['reddit'][i]['mention'];
            this.pos_mention_red=this.pos_mention_red+this.insights_data[1]['reddit'][i]['positiveMention'];
            this.neg_mention_red=this.neg_mention_red+this.insights_data[1]['reddit'][i]['negativeMention'];
            this.tot_mention_twi=this.tot_mention_twi+this.insights_data[1]['twitter'][i]['mention'];
            this.pos_mention_twi=this.pos_mention_twi+this.insights_data[1]['twitter'][i]['positiveMention'];
            this.neg_mention_twi=this.neg_mention_twi+this.insights_data[1]['twitter'][i]['negativeMention'];
          }
        })

        this.handlingSummary1(ticker);
        // this.service.searchdone = true;
      }
  })
  }

  handlingSummary1(ticker) {
		if (localStorage.getItem('watchlist') === null) { 
      this.isInWL = false;
		}
		else {
			let watchlist = JSON.parse(localStorage.getItem('watchlist'));
			if (ticker in watchlist) {	
        this.isInWL = true;
			}
			else {	
        this.isInWL = false;
			}
    }

    if(localStorage.getItem('purchases') === null){
      this.isInPr = false;
    }
    else{
      let purchase = JSON.parse(localStorage.getItem('purchases'));
      if (ticker in purchase){
        this.isInPr = true;
      }else{
        this.isInPr = false;
      }
    }
  }

  createHourlyCharts1(ticker){
    let hourlyInstance = []
    let priceLength = this.hourlyPrices.c.length,i
    for (i=0; i<priceLength; i++){
      hourlyInstance.push([this.hourlyPrices.t[i]*1000,this.hourlyPrices.c[i]])
    }
    this.hourlyChartOptions = {
      series:[
        {
          data: hourlyInstance,
          name : ticker.toUpperCase() ,
          type: 'line',
          color:this.chartLineColor,
          tooltip:{
            valueDecimals:2,
          },
        },
      ],
      title: { text: ticker?.toUpperCase() + ' Hourly Price Variation' },
      rangeSelector: {
        enabled: false,
      },
      navigator: {
        enabled: false
    },
      time: {
        getTimezoneOffset: getLATimezone,
      },
    }
  }

  createHistoricalCharts1(ticker){
    let ohlc_data = [],stock_volume= [],data_length = this.historicalPrices.t.length
    for(let i = 0;i<data_length;i++){
      ohlc_data.push([
        this.historicalPrices.t[i]*1000,
        this.historicalPrices.o[i],
        this.historicalPrices.h[i],
        this.historicalPrices.l[i],
        this.historicalPrices.c[i]
      ])
      stock_volume.push([
        this.historicalPrices.t[i]*1000,
        this.historicalPrices.v[i]
      ])
    }
    this.ohlcCHarts={
      series:[
        {
          type: 'candlestick',
          name: ticker!.toUpperCase(),
          id: ticker!,
          zIndex: 2,
          data: ohlc_data,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: stock_volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo!: ticker,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: ticker,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
      title: { text: ticker!.toUpperCase() + 'Historical' },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      yAxis:[
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 6,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      rangeSelector: {
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1m',
          },
          {
            type: 'month',
            count: 3,
            text: '3m',
          },
          {
            type: 'month',
            count: 6,
            text: '6m',
          },
          {
            type: 'ytd',
            text: 'YTD',
          },
          {
            type: 'year',
            count: 1,
            text: '1y',
          },
          {
            type: 'all',
            text:'All',
          },
        ],
        selected: 2,
      },
      time: {
        getTimezoneOffset: getLATimezone,
      },
    }
  }

  createRecommendationCharts1(){
    this.recommendationChart ={
      chart: {
        type: 'column'
    },
    colors:['#730202','#CC1D28','#DB7E04','#04CF1C','#01750F' ],
    title: {
      text: 'Recommendation trends'
  },
  xAxis: {
    categories: ['2021-12-01', '2022-01-01', '2022-02-01', '2022-03-01']
  },
  yAxis: {
    min: 0,
    title: {
        text: 'Total fruit consumption'
    },
    stackLabels: {
        enabled: true,
        style: {
            fontWeight: 'bold',
        }
    }
  },
  legend: {
    align: 'right',
    x: -30,
    verticalAlign: 'top',
    y: 25,
    floating: true,
    backgroundColor:'white',
    borderColor: '#CCC',
    borderWidth: 1,
    shadow: false
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
  },
  plotOptions: {
    column: {
        stacking: 'normal',
        dataLabels: {
            enabled: true
        }
    }
  },
  series:[{
    type:'column',
    name: 'StrongSell',
    data:this.companyRecommendations.strongBuy
  },
  {
    type:'column',
    name: 'Sell',
    data:this.companyRecommendations.sell
  },
  {
    type:'column',
    name: 'Hold',
    data:this.companyRecommendations.hold
  },
  {
    type:'column',
    name: 'Buy',
    data:this.companyRecommendations.buy
  },
  {
    type:'column',
    name: 'StrongBuy',
    data:this.companyRecommendations.strongBuy
  },
  ]
    }
  }

  createEarningsChart1(){
    this.earningsChart={
      chart: {
        type: 'spline',
        // inverted: true
    },
    title: {
      text: 'Historical EPS Surprises'
  },
  xAxis: {
    reversed: false,
    maxPadding: 0.05,
    showLastLabel: true,
   categories: [this.companyEarnings[0]['period']+'<br>'+this.companyEarnings[0]['surprise'],
   this.companyEarnings[1]['period']+'<br>'+this.companyEarnings[1]['surprise'],
   this.companyEarnings[2]['period']+'<br>'+this.companyEarnings[2]['surprise'],
   this.companyEarnings[3]['period']+'<br>'+this.companyEarnings[3]['surprise']
  ]
  /*   categories: ['2021-13-05'+'0.123','2043-05-98','230-98-78'] */
  },
  yAxis: {
    min: 0,
    title: {
        text: 'Quarterly EPS'
    },
    lineWidth: 2
  },
  legend: {
    enabled: false
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
  },
  // plotOptions: {
  //   spline: {
  //     marker: {
  //         enable: false
  //     }
  // }
  // },
  series:[{
    type:'spline',
    name: 'Actual',
    data: [[this.companyEarnings[0]['period'],this.companyEarnings[0]['actual']],
    [this.companyEarnings[1]['period'],this.companyEarnings[1]['actual']],
    [this.companyEarnings[2]['period'],this.companyEarnings[2]['actual']],
    [this.companyEarnings[3]['period'],this.companyEarnings[3]['actual']]]
  },
  {
    type:'spline',
    name: 'Estimate',
    data: [[this.companyEarnings[0]['period'],this.companyEarnings[0]['estimate']],
    [this.companyEarnings[1]['period'],this.companyEarnings[1]['estimate']],
    [this.companyEarnings[2]['period'],this.companyEarnings[2]['estimate']],
    [this.companyEarnings[3]['period'],this.companyEarnings[3]['estimate']]]
  },
  ]
    }
  }
  

//   create_stacked_charts1(ticker){
//     this.TrendChartOptions={
//       chart: {
//         type: 'column'
//     },
//     title: {
//       text: 'Recommendation Trends'
//   },
//   xAxis: {
//     categories: [this.insights_data[2][0]['period'],this.insights_data[2][1]['period'],this.insights_data[2][2]['period'],this.insights_data[2][3]['period']]
// },
// yAxis: {
//   min: 0,
//   title: {
//       text: 'Total fruit consumption'
//   },
//   stackLabels: {
//       enabled: true,
//       style: {
//           fontWeight: 'bold',
//           color: ( // theme
//               Highcharts.defaultOptions.title.style &&
//               Highcharts.defaultOptions.title.style.color
//           ) || 'gray'
//       }
//   }
// },
// legend: {
//   align: 'right',
//   x: -30,
//   verticalAlign: 'top',
//   y: 25,
//   floating: true,
//   backgroundColor:
//       Highcharts.defaultOptions.legend.backgroundColor || 'white',
//   borderColor: '#CCC',
//   borderWidth: 1,
//   shadow: false
// },
// colors:['#730202','#CC1D28','#DB7E04','#04CF1C','#01750F' ],
// tooltip: {
//   headerFormat: '<b>{point.x}</b><br/>',
//   pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
// },
// plotOptions: {
//   column: {
//       stacking: 'normal',
//       dataLabels: {
//           enabled: true
//       }
//   }
// },
// series: [{
//   type:'column',
//   name: 'John',
//   data: [5,8,4,7]
// }, {
//   type:'column',
//   name: 'John',
//   data: [5,8,4,7]
// }, {
//   type:'column',
//   name: 'John',
//   data: [5,8,4,7]
// },
// {
//   type:'column',
//   name: 'John',
//   data: [5,8,4,7]
// },
// {
//   type:'column',
//   name: 'John',
//   data: [5,3,4,7]
// },
// ]
//     }
//   }

    
}






