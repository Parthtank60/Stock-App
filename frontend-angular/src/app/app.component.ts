import { Component, OnInit } from '@angular/core';
import { AppServiceService } from './app-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend-angular';
  public isMenuCollapsed = true;
  public searchstatus:boolean = false;
  constructor(private service: AppServiceService){}
  ngOnInit(){
    // this.getDatafromAPI()
    if(this.service.searchdone){
      this.searchstatus = true
    }
  }
  // getDatafromAPI(){
  //   this.service.getCompany('TSLA').subscribe((response) => {
  //     console.log(response)

  //   },(error)=>{
  //     console.log('error',error)
  //   })

  }

