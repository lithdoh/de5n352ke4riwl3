import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FrameComponent } from './parts/frame/frame.component';
import { RearshockComponent } from './parts/rearshock/rearshock.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'parts/frame', component: FrameComponent },
  { path: 'parts/rearshock', component: RearshockComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
