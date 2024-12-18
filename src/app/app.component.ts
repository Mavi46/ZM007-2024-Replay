import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReplayComponent } from './replay/replay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReplayComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'replay';
}
