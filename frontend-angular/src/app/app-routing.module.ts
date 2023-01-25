import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WatchlistComponent} from './watchlist/watchlist.component';
import {PortfolioComponent} from './portfolio/portfolio.component';
import {SearchComponent} from './search/search.component';
import {DetailsComponent} from './details/details.component';

const routes: Routes = [
  {path: '', redirectTo:'/search/home', pathMatch:'full'},
  {path: 'search/home', component: SearchComponent},
  {path: 'search/:ticker', component: DetailsComponent},
  {path: 'watchlist', component: WatchlistComponent},
  {path: 'portfolio', component: PortfolioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
