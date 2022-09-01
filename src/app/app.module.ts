import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FrameComponent } from './parts/frame/frame.component';
import { RearshockComponent } from './parts/rearshock/rearshock.component';
import { BarsComponent } from './parts/bars/bars.component';
import { StemComponent } from './parts/stem/stem.component';
import { MATbarsComponent } from './parts/matbars/matbars.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FrameComponent,
    RearshockComponent,
    BarsComponent,
    StemComponent,
    MATbarsComponent,
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
