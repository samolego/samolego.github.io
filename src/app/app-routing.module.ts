import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {E404Component} from "./e404/e404.component";
import {DonateComponent} from "./donate/donate.component";
import {ProjectsComponent} from "./projects/projects.component";
import {ProjectComponent} from "./projects/project/project.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'donate',
    component: DonateComponent
  },
  {
    path: 'projects',
    component: ProjectsComponent
  },
  {
    path: 'projects/:project',
    component: ProjectComponent
  },
  {
    path: '**',
    component: E404Component
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
