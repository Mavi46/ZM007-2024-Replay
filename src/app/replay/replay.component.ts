import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-replay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './replay.component.html',
  styleUrl: './replay.component.scss'
})
export class ReplayComponent {
  curtainColors = ['#8B548F', '#BB4848', '#00BA85', '#1F1A65']; // Paars, Rood, Groen, Blauw
  currentColorIndex = 0;
  curtainColor = this.curtainColors[this.currentColorIndex];
  curtainOpened = false;
  displayText = 'Welkom!';

  ngOnInit(): void {
    this.startAnimationCycle();
  }

  startAnimationCycle(): void {
    this.openCurtains();
  }

  openCurtains(): void {
    setTimeout(() => {
      this.curtainOpened = true;
      setTimeout(() => this.closeCurtains(), 5000);
    }, 3000);


  }

  fadeToNextColor(): void {
    this.currentColorIndex = (this.currentColorIndex + 1) % this.curtainColors.length;
    this.curtainColor = this.curtainColors[this.currentColorIndex];
  }

  closeCurtains(): void {
    this.curtainOpened = false;
    setTimeout(() => {
      this.openCurtains(),
        setTimeout(() => this.fadeToNextColor(), 3000);
    }, 1000);
  }

}
