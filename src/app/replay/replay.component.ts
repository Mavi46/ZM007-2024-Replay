import { Component } from '@angular/core';

@Component({
  selector: 'app-replay',
  standalone: true,
  imports: [],
  templateUrl: './replay.component.html',
  styleUrl: './replay.component.scss'
})
export class ReplayComponent {
  curtainColors = ['#8B548F', '#BB4848', '#00BA85', '#1F1A65']; // Paars, Rood, Groen, Blauw
  currentColorIndex = 0;
  curtainColor = this.curtainColors[this.currentColorIndex];
  curtainOpened = false;
  displayText = 'Welkom! asdhasdhasihdgasidgaisgdiasgdahsgdhsagduhgasudasguydgsauydgasuydguyasgduyaguydsgauydguasygduygausaguydgsauydguasydguyasgduagsuydgsaudgaus';


  ngOnInit(): void {
    this.startAnimationCycle();
  }

  startAnimationCycle(): void {
    this.openCurtains();
  }

  closeCurtains(): void {
    this.curtainOpened = false;
    setTimeout(() => this.changeColor(), 1000);
  }

  changeColor(): void {
    this.currentColorIndex = (this.currentColorIndex + 1) % this.curtainColors.length;
    this.curtainColor = this.curtainColors[this.currentColorIndex];
    this.openCurtains();
  }

  openCurtains(): void {
    setTimeout(() => {
      this.curtainOpened = true;
      setTimeout(() => this.closeCurtains(), 5000);
    }, 3000);
  }

}
