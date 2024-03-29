import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MathomeComponent } from './mathome/mathome.component';
import { BarsComponent } from './parts/bars/bars.component';
import { FrameComponent } from './parts/frame/frame.component';
import { MATbarsComponent } from './parts/matbars/matbars.component';
import { MatstemsComponent } from './parts/matstems/matstems.component';
import { Matstems2Component } from './parts/matstems2/matstems2.component';
import { Matstems3Component } from './parts/matstems3/matstems3.component';
import { RearshockComponent } from './parts/rearshock/rearshock.component';
import { StemsComponent } from './parts/stems/stems.component';
import { DegreePipe } from './pipes/degree.pipe';
import { DollarsPerGramPipe } from './pipes/dollars-per-gram.pipe';
import { GramsPipe } from './pipes/grams.pipe';
import { MillimeterPipe } from './pipes/millimeter.pipe';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import { SidebarFilterComponent } from './sidebar-filter/sidebar-filter.component';
import { Matstems4Component } from './parts/matstems4/matstems4.component';
import { Matstems5Component } from './parts/matstems5/matstems5.component';
import { StatusComponent } from './status/status.component';
import { StemCheckboxFiltersComponent } from './parts/stem-checkbox-filters/stem-checkbox-filters.component';
import {MatChipsModule} from '@angular/material/chips';
import { RangeFiltersComponent } from './parts/range-filters/range-filters/range-filters.component';
import { Matbars2Component } from './parts/matbars2/matbars2.component';
import { BarCheckboxFiltersComponent } from './parts/bar-checkbox-filters/bar-checkbox-filters.component';

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
    Matstems3Component,
    SidebarFilterComponent,
    Matstems4Component,
    Matstems5Component,
    StatusComponent,
    StemCheckboxFiltersComponent,
    RangeFiltersComponent,
    Matbars2Component,
    BarCheckboxFiltersComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
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
    MatSidenavModule,
    MatCheckboxModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule,
    MatIconModule,
    MatChipsModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
