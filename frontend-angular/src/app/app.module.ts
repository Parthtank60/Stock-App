import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SearchComponent } from './search/search.component';
import { DetailsComponent } from './details/details.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalComponent } from './modal/modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule} from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatTabsModule } from '@angular/material/tabs'

import{HighchartsChartModule} from 'highcharts-angular'

@NgModule({
  declarations: [
    AppComponent,
    WatchlistComponent,
    PortfolioComponent,
    SearchComponent,
    DetailsComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    HighchartsChartModule
  ],
  providers: [],
  entryComponents: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
