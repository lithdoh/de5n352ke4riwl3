import { NgModule } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MathomeComponent } from './mathome/mathome.component';
import { BarsComponent } from './parts/bars/bars.component';
import { FrameComponent } from './parts/frame/frame.component';
import { MATbarsComponent } from './parts/matbars/matbars.component';
import { MatstemsComponent } from './parts/matstems/matstems.component';
import { RearshockComponent } from './parts/rearshock/rearshock.component';
import { StemsComponent } from './parts/stems/stems.component';
import { TabletestsComponent } from './tabletests/tabletests.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FrameComponent,
    RearshockComponent,
    BarsComponent,
    StemsComponent,
    MATbarsComponent,
    MatstemsComponent,
    MathomeComponent,
    TabletestsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
