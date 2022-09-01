import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BarsComponent } from './parts/bars/bars.component';
import { HomeComponent } from './home/home.component';
import { FrameComponent } from './parts/frame/frame.component';
import { RearshockComponent } from './parts/rearshock/rearshock.component';
import { StemComponent } from './parts/stem/stem.component';
import { MATbarsComponent } from './parts/matbars/matbars.component';

const routes: Routes = [
  { path: 'parts/frame', component: FrameComponent },
  { path: 'parts/rearshock', component: RearshockComponent },
  { path: 'parts/bars', component: BarsComponent },
  { path: 'parts/stem', component: StemComponent },
  { path: 'parts/rearbrake', component: MATbarsComponent },
  { path: 'home', component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
