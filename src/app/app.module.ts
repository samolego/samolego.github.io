import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {HomeComponent} from './home/home.component';
import {E404Component} from './e404/e404.component';
import {DonateComponent} from './donate/donate.component';
import {FormsModule} from "@angular/forms";
import {ProjectsComponent} from './projects/projects.component';
import {ProjectComponent} from './projects/project/project.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    E404Component,
    DonateComponent,
    ProjectsComponent,
    ProjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
