import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarsComponent } from './parts/bars/bars.component';
import { HomeComponent } from './home/home.component';
import { FrameComponent } from './parts/frame/frame.component';
import { RearshockComponent } from './parts/rearshock/rearshock.component';
import { StemsComponent } from './parts/stems/stems.component';
import { MATbarsComponent } from './parts/matbars/matbars.component';
import { MatstemsComponent } from './parts/matstems/matstems.component';
import { Matstems2Component } from './parts/matstems2/matstems2.component';
import { MathomeComponent } from './mathome/mathome.component';
import { Matstems3Component } from './parts/matstems3/matstems3.component';
import { Matstems4Component } from './parts/matstems4/matstems4.component';
import { Matstems5Component } from './parts/matstems5/matstems5.component';
import { StatusComponent } from './status/status.component';
import { Matbars2Component } from './parts/matbars2/matbars2.component';

const routes: Routes = [
  { path: 'parts/frame', component: FrameComponent },
  { path: 'parts/rearshock', component: RearshockComponent },
  { path: 'parts/bars', component: BarsComponent },
  { path: 'parts/stems', component: StemsComponent },
  { path: 'parts/rearbrake', component: MATbarsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'parts/frontbrake', component: MatstemsComponent },
  { path: 'parts/chain', component: MathomeComponent },
  { path: 'parts/matbars', component: MATbarsComponent },
  { path: 'parts/matstems', component: MatstemsComponent },
  { path: 'parts/matstems2', component: Matstems2Component },
  { path: 'parts/matstems3', component: Matstems3Component },
  { path: 'parts/matstems4', component: Matstems4Component },
  { path: 'parts/matstems5', component: Matstems5Component },
  { path: 'parts/matbars2', component: Matbars2Component },
  { path: '', redirectTo: 'parts/matstems5', pathMatch: 'full' },
  { path: "**", component: StatusComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
