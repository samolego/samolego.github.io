import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects/projects.component';
import { CiComponent } from './projects/ci/ci.component';
import { HomeComponent } from './home/home.component';
import { VideosComponent } from './videos/videos.component';
import { AndroidComponent } from './android/android.component';
import { DonateComponent } from './donate/donate.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'projects/ci',
    component: CiComponent
  },
  {
    path: 'projects/ci/:project',
    component: CiComponent
  },
  {
    path: 'projects/ci/:project/:build',
    component: CiComponent
  },
  {
    path: 'videos',
    component: VideosComponent
  },
  {
    path: 'android',
    component: AndroidComponent
  },
  {
    path: 'donate',
    component: DonateComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
