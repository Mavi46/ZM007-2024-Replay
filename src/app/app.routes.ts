import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReplayComponent } from './replay/replay.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'replay', component: ReplayComponent },
];
