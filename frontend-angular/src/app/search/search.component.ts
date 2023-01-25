import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounce, debounceTime, finalize, switchMap, tap } from 'rxjs';
import { Recommendation } from '../recommendation';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  recommendations:any = [];
  resultantCompanies: Recommendation[] = []
  search_text:string ="";
  recommendationLoading=false;
  searchField!: FormGroup;
  text:string="";
  ifblock = false;
  
  public name:string ='';
  public isVisible =  false

  constructor( private router: Router, private service : AppServiceService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.searchField = this.formBuilder.group({textInput: ''})
    this.searchField.get('textInput')?.valueChanges.pipe(
      debounceTime(300),
      tap(()=>(this.recommendationLoading = true)),
      switchMap((value) =>
      this.service.getAutoCompleteText(value).pipe(finalize(()=>(this.recommendationLoading = false)))
      )
    )
    .subscribe((tickers) => this.recommendations = tickers)

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
      this.getDatafromAPI(tickerData.textInput.symbol)
      this.router.navigate(['/search',tickerData.textInput.symbol])

    }
    else{
      if (tickerData.textInput === ''){
        console.log('hahaha')
        this.ifblock = true
      }
      else{
        console.log('direct enter')
        this.ifblock = false
        this.getDatafromAPI(tickerData.textInput)
      this.router.navigate(['/search',tickerData.textInput])
      }
    }
    
  }
  onSubmitClick(tickerData:any) {
    console.log(tickerData.textInput)
    console.log('ticker name in form: ', tickerData);
    this.getDatafromAPI(tickerData.textInput)
    this.router.navigate(['/search',tickerData.textInput])
  }

  displayTicker(company: Recommendation) {
    if (company) {
      return company.displaySymbol;
    }
    return ""
  }

}
