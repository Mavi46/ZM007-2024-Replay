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
  curtainColors = ['#8B548F', '#BB4848', '#00BA85', '#1F1A65']; // Paars HCI, Rood SE, Groen DataE, Blauw Security
  currentColorIndex = 0;
  curtainColor = this.curtainColors[this.currentColorIndex];
  nextCurtainColor = this.curtainColors[this.currentColorIndex];
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
      this.curtainColor = this.curtainColors[this.currentColorIndex];
      if (this.curtainColor === '#8B548F') {
        this.handlePurpleTextChange();
        setTimeout(() => this.hciPopup = true, 10000);
      } else if (this.curtainColor === '#BB4848') {
        this.handleRedTextchange();
      } else if (this.curtainColor === '#00BA85') {
        console.log("Kleur is Groen");
      } else if (this.curtainColor === '#1F1A65') {
        console.log("Kleur is Blauw");
      }


      setTimeout(() => this.closeCurtains(), 15000);
    }, 3000);
  }

  fadeToNextColor(): void {
    this.currentColorIndex = (this.currentColorIndex + 1) % this.curtainColors.length;
    this.nextCurtainColor = this.curtainColors[this.currentColorIndex];
  }

  closeCurtains(): void {
    if (this.currentColorIndex === this.curtainColors.length - 1) {
      return;
    }
    this.curtainOpened = false;
    this.fadeToNextColor();
    setTimeout(() => {
      this.openCurtains()
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
      'Software Engineering',
      'Nu kunnen we dit',
    ];

    this.startTextRotation(redTexts);
  }

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
