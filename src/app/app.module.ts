import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MathomeComponent } from './mathome/mathome.component';
import { BarsComponent } from './parts/bars/bars.component';
import { FrameComponent } from './parts/frame/frame.component';
import { MATbarsComponent } from './parts/matbars/matbars.component';
import { MatstemsComponent } from './parts/matstems/matstems.component';
import { RearshockComponent } from './parts/rearshock/rearshock.component';
import { StemsComponent } from './parts/stems/stems.component';
import { DegreePipe } from './pipes/degree.pipe';
import { MillimeterPipe } from './pipes/millimeter.pipe';
import { Matstems2Component } from './parts/matstems2/matstems2.component';
import { GramsPipe } from './pipes/grams.pipe';
import { DollarsPerGramPipe } from './pipes/dollars-per-gram.pipe';
import {ReactiveFormsModule} from '@angular/forms';
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
    DegreePipe,
    MillimeterPipe,
    Matstems2Component,
    GramsPipe,
    DollarsPerGramPipe,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    HttpClientModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
