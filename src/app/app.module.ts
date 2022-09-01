import { NgModule } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BarsComponent } from './parts/bars/bars.component';
import { FrameComponent } from './parts/frame/frame.component';
import { MATbarsComponent } from './parts/matbars/matbars.component';
import { MatstemsComponent } from './parts/matstems/matstems.component';
import { RearshockComponent } from './parts/rearshock/rearshock.component';
import { StemComponent } from './parts/stem/stem.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FrameComponent,
    RearshockComponent,
    BarsComponent,
    StemComponent,
    MATbarsComponent,
    MatstemsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    MatTableModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
