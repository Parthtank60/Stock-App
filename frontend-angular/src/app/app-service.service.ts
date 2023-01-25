import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable} from 'rxjs'
import {Recommendation} from './recommendation'

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  public searchdone: boolean = false;

  public readonly EndPoint: string = "http://localhost:5000"

  constructor(private http: HttpClient) {
   }

   getCompany(ticker: string){
     let url = this.EndPoint+'/search?tickername='+ticker
    //  console.log(this.http.get(url))
     return this.http.get(url)
   }

   getLatestPrice(ticker: string){
     console.log('fecthing pricwes')
    let url = this.EndPoint+'/current-price?tickername='+ticker
    return this.http.get(url)
   }

   getAutoCompleteText(ticker:string):Observable<Recommendation[]>{
    let url = this.EndPoint+'/autocomplete-text?queryString='+ticker
    // console.log(url)
    return this.http.get<Recommendation[]>(url)
  }

  getCompanyPeers(ticker:string):Observable<string[]>{
    console.log('peers')
    let url = this.EndPoint+'/get-company-peers?symbol='+ticker
    return this.http.get<string[]>(url)
  }

  getHourlyData(ticker: string):Observable<string[]>{
    console.log('hourlydata')
    let url = this.EndPoint+'/get-historical-data?tickername='+ticker+'&resolution='+5
    return this.http.get<string[]>(url)
  }
  getInsights(ticker: string){
    let url = this.EndPoint+'/insights?tickername='+ticker
    return this.http.get(url)
  }

  getCompanyNewsDetails(ticker: string){
    let url = this.EndPoint+'/get-latest-news?tickername='+ticker
    return this.http.get(url)
  }

  getHistoricalData(ticker: string):Observable<string[]>{
    console.log('historical')
    let url = this.EndPoint+'/get-historical-data?tickername='+ticker+'&resolution=D'
    return this.http.get<string[]>(url)
  }

  getSentiments(ticker:string){
    let url = this.EndPoint + '/get-company-sentiment?symbol=' + ticker
    return this.http.get(url)
  }

  getCompanyRecommendations(ticker:string){
    console.log('compnay recommd')
    let url = this.EndPoint + '/get-recommendation-trends?tickername=' + ticker
    return this.http.get(url)
  }
  getCompanyEarnings(ticker:string){
    let url= this.EndPoint + '/get-company-earnings?tickername=' + ticker
    return this.http.get(url)
  }
}


