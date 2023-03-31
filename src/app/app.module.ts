import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyFormFieldModule as MatFormFieldModule, MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import { SidebarFilterComponent } from './sidebar-filter/sidebar-filter.component';
import { Matstems4Component } from './parts/matstems4/matstems4.component';
import { Matstems5Component } from './parts/matstems5/matstems5.component';
import { StatusComponent } from './status/status.component';
import { StemCheckboxFiltersComponent } from './parts/stem-checkbox-filters/stem-checkbox-filters.component';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';

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
