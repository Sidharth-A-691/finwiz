import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BankingComponent } from './banking/banking.component';
import { GoalComponent } from './goal/goal.component';
import { SuggestionComponent } from './suggestion/suggestion.component';

@NgModule({
  declarations: [
    AppComponent,
    BankingComponent,
    GoalComponent,
    SuggestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
