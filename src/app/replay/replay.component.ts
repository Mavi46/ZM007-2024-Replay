import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-replay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './replay.component.html',
  styleUrl: './replay.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      state('out', style({ transform: 'translateY(-100%)', opacity: 0 })),
      transition('in => out', [animate('500ms ease-in')]),
      transition('out => in', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-out')
      ])
    ])
  ]
})
export class ReplayComponent {
  curtainColors = ['#8B548F', '#BB4848', '#00BA85', '#1F1A65']; // Paars, Rood, Groen, Blauw
  currentColorIndex = 0;
  curtainColor = this.curtainColors[this.currentColorIndex];
  curtainOpened = false;
  h1RotationText: string = '';
  h1State = 'in';

  // Scherm HCI
  hciPopup: boolean = false;

  ngOnInit(): void {
    this.startAnimationCycle();
  }

  startAnimationCycle(): void {
    this.openCurtains();
    // this.curtainOpened = true;
  }

  openCurtains(): void {
    setTimeout(() => {
      this.curtainOpened = true;

      // Controleer op de huidige kleur en voer acties uit
      if (this.curtainColor === '#8B548F') {
        this.handlePurpleTextChange();
        setTimeout(() => this.hciPopup = true, 10000);
      } else if (this.curtainColor === '#BB4848') {
        this.handleRedTextchange();
      } else if (this.curtainColor === '#00BA85') {
        console.log("Rotatie gestart");
      } else if (this.curtainColor === '#1F1A65') {
        console.log("Rotatie gestart");
      }


      setTimeout(() => this.closeCurtains(), 15000);
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

  handlePurpleTextChange(): void {
    const purpleTexts = [
      'HCI',
      'Door onze aantrekkelijke visualisatie heb jij ons zomaar gegevens gegeven',
      'Deze info weten we over jou'
    ];
    this.startTextRotation(purpleTexts);
  }

  handleRedTextchange(): void {
    const redTexts = [
      'Rood tekst 1',
      'Rood tekst 2',
      'Rood tekst 3'
    ];

    this.startTextRotation(redTexts);
  }




  // startTextRotation(texts: string[]): void {
  //   let currentIndex = 0;
  //   this.h1RotationText = texts[currentIndex];

  //   const textInterval = setInterval(() => {
  //     currentIndex++;
  //     if (currentIndex >= texts.length) {
  //       clearInterval(textInterval);
  //     } else {
  //       this.h1RotationText = texts[currentIndex];
  //     }
  //   }, 3500);
  // }

  startTextRotation(texts: string[]): void {
    let currentIndex = 0;
    this.h1RotationText = texts[currentIndex];
    this.h1State = 'in';

    const textInterval = setInterval(() => {
      if (currentIndex < texts.length - 1) {
        this.h1State = 'out';
        setTimeout(() => {
          currentIndex++;
          this.h1RotationText = texts[currentIndex];
          this.h1State = 'in';
        }, 500);
      } else {
        clearInterval(textInterval);
      }
    }, 3500);
  }











}
