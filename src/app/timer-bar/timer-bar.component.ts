import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timer-bar',
  standalone: true,
  imports: [],
  templateUrl: './timer-bar.component.html',
  styleUrl: './timer-bar.component.scss'
})
export class TimerBarComponent {
  @Input() progress: number = 0;
}
