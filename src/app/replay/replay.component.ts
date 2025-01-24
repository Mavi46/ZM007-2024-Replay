import { Component, ɵDeferBlockConfig } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TypewriterDirective } from '../directives/typewriter.directive';
import { UserProfile } from '../interfaces/replay-data';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplayService } from '../services/replay.service';
import { TimerBarComponent } from '../timer-bar/timer-bar.component';

@Component({
  selector: 'app-replay',
  standalone: true,
  imports: [CommonModule, TypewriterDirective, TimerBarComponent],
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
  curtainColors = ['#5D275D', '#B13E53', '#00BA85', '#3B5DC9', '#29366F']; // Purple HCI, Red SE, Green DataE, Blue Security, Ending
  // curtainColors = ['#00BA85'];
  currentColorIndex = 0;
  curtainColor = this.curtainColors[this.currentColorIndex];
  nextCurtainColor = this.curtainColors[this.currentColorIndex];
  curtainOpened = false;

  // Screen Initialisation
  h1TextArray: string[] = [];
  h1CurrentTextIndex: number = 0;
  h1State: 'in' | 'out' = 'in';
  h1RotationText: string = '';
  screenElementsShowed: boolean = false;

  // Timer & controls
  timerDuration: number = 10000; // Seconds per element
  timeRemaining: number = this.timerDuration;
  timerInterval: any = null;
  isPaused: boolean = false;
  controlsActive: boolean = false;

  //User Profile
  userProfile!: UserProfile | null;
  qrScanned: boolean = false;
  mailClicked: boolean = false;


  // Screen HCI
  hciPopup: boolean = false;

  // Screen SE
  typedScriptName: string = '';
  typedScriptContent: string = '';

  // Screen Security
  showVideo: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private replayService: ReplayService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];

      if (id) {
        this.replayService.getUserProfileById(id).subscribe({
          next: (profile) => {
            if (profile) {
              this.userProfile = profile;
              window.addEventListener('keydown', this.onKeyDown.bind(this));
              this.openCurtain();
            } else {
              console.warn('No profile found for ID:', id);
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            console.error('Error loading user profile:', err);
            this.router.navigate(['/']);
          }
        });
      } else {
        console.warn('No ID provided in query parameters');
        this.router.navigate(['/']);
      }
    });
  }

  openCurtain(): void {
    setTimeout(() => {

      setTimeout(() => {
        this.controlsActive = true;
      }, 1500);

      this.curtainOpened = true;
      this.curtainColor = this.curtainColors[this.currentColorIndex];
      if (this.curtainColor === '#5D275D') { // Purple - HCI
        this.providePurpleText();
        this.startTimer();
      } if (this.curtainColor === '#B13E53') { // Red - SE
        this.provideRedText();
        this.startTimer();
      } if (this.curtainColor === '#00BA85') { // Green - DE
        this.provideGreenText();
        this.startTimer();
      } if (this.curtainColor === '#3B5DC9') { // Blue - Security
        this.provideBlueText();
        this.startTimer();
      } if (this.curtainColor === '#29366F') { // Ending
        this.provideEndingText();
        this.startTimer();
      }
    }, 3000);
  }

  startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Reset timeRemaining naar timerDuration
    this.timeRemaining = this.timerDuration;

    setTimeout(() => {
      this.timerInterval = setInterval(() => {

        if (!this.isPaused && this.timeRemaining > 0) {
          this.timeRemaining -= 100;

          // Controleer of de timer volledig leeg is
          if (this.timeRemaining <= 0) {
            setTimeout(() => {
              this.timeRemaining = 0;
              clearInterval(this.timerInterval);
              this.timerInterval = null;
              this.nextAction();
            }, 1000);
          }
        }
      }, 100);
    }, 1000);


  }

  controlLock(short: boolean): void {
    this.controlsActive = false;
    if (short) {
      console.log('Lock, 2 seconden.');
      setTimeout(() => {
        this.controlsActive = true;
      }, 2000);
    } else {
      console.log('Lock, 6 seconden.');
      setTimeout(() => {
        this.controlsActive = true;
      }, 6000);
    }



  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.controlsActive) {
      if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        this.isPaused = !this.isPaused;
      } else if (event.code === 'ArrowRight') {
        event.preventDefault();
        this.nextAction();
      }
    }
  }

  nextAction(): void {
    if (this.curtainColor === '#5D275D') { // Purple - HCI
      if (!this.screenElementsShowed) {
        this.controlLock(true);
        this.purpleNextElement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
        this.controlLock(false);
        this.closeCurtains();
      }
    } if (this.curtainColor === '#B13E53') { // Red - SE
      if (!this.screenElementsShowed) {
        this.controlLock(true);
        this.redNextElement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
        this.controlLock(false);
        this.closeCurtains();
      }
    } if (this.curtainColor === '#00BA85') { // Green - DE
      if (!this.screenElementsShowed) {
        this.controlLock(true);
        this.greenNextElement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
        this.controlLock(false);
        this.closeCurtains();
      }
    } if (this.curtainColor === '#3B5DC9') { // Blue - Security
      if (!this.screenElementsShowed) {
        this.controlLock(true);
        this.blueNextElement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
        this.controlLock(false);
        this.closeCurtains();
      }
    } if (this.curtainColor === '#29366F') { // Ending
      if (!this.screenElementsShowed) {
        this.controlLock(true);
        this.endingNextelement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
        this.controlLock(false);
        this.closeCurtains();
      }
    }

    this.startTimer();

  }

  purpleNextElement(): void {
    if (this.h1CurrentTextIndex < this.h1TextArray.length - 1) {
      this.h1State = 'out';
      setTimeout(() => {
        this.h1CurrentTextIndex++;
        this.h1RotationText = this.h1TextArray[this.h1CurrentTextIndex];
        this.h1State = 'in';
      }, 500);
    } else {
      this.hciPopup = true;
      this.screenElementsShowed = true;
    }
  }

  redNextElement(): void {
    if (this.h1CurrentTextIndex < this.h1TextArray.length - 1) {
      this.h1State = 'out';
      setTimeout(() => {
        this.h1CurrentTextIndex++;
        this.h1RotationText = this.h1TextArray[this.h1CurrentTextIndex];
        this.h1State = 'in';
      }, 500);
    } else if (!this.typedScriptName) {
      this.typedScriptName = 'run webscraping.py';
      setTimeout(() => {
        this.typedScriptContent = `
import requests
from bs4 import BeautifulSoup

url = "https://example.com/profile/janedoe123"
pagina = requests.get(url)
soup = BeautifulSoup(pagina.text, "html.parser")

naam = soup.find("span", class_="name").text
email = soup.find("a", class_="email").text

requests.post(post_url, json=data)`;
      }, this.typedScriptName.length * 50);
      this.screenElementsShowed = true;
    }

  }

  greenNextElement(): void {
    if (this.h1CurrentTextIndex < this.h1TextArray.length - 1) {
      this.h1State = 'out';
      setTimeout(() => {
        this.h1CurrentTextIndex++;
        this.h1RotationText = this.h1TextArray[this.h1CurrentTextIndex];
        this.h1State = 'in';

        // Check if it is the last element to set the flag
        if (this.h1CurrentTextIndex === this.h1TextArray.length - 1) {
          this.screenElementsShowed = true;
        }
      }, 500);
    }
  }

  blueNextElement(): void {
    if (this.h1CurrentTextIndex < this.h1TextArray.length - 1) {
      this.h1State = 'out';
      setTimeout(() => {
        this.h1CurrentTextIndex++;
        this.h1RotationText = this.h1TextArray[this.h1CurrentTextIndex];
        this.h1State = 'in';
      }, 500);
    } else {
      this.isPaused = true; // Timer will be paused to play the full video
      this.showVideo = true;
      this.screenElementsShowed = true;
    }
  }

  endingNextelement(): void {
    this.isPaused = false; // Timer will proceed as the timer is paused on the previous screen.
    if (this.h1CurrentTextIndex < this.h1TextArray.length - 1) {
      this.h1State = 'out';
      setTimeout(() => {
        this.h1CurrentTextIndex++;
        this.h1RotationText = this.h1TextArray[this.h1CurrentTextIndex];
        this.h1State = 'in';

        // Check if it is the last element to set the flag
        if (this.h1CurrentTextIndex === this.h1TextArray.length - 1) {
          this.screenElementsShowed = true;
        }
      }, 500);
    }
  }









  providePurpleText(): void {
    this.h1TextArray = [
      'Mens-computerinteractie (MCI) is een vakgebied binnen de informatiekunde dat zich bezighoudt met onderzoek naar de interactie (wisselwerking) tussen mensen (gebruikers) en machines (waaronder computers)',
      'Onze applicatie is ontworpen waarbij specifieke keuzes gemaakt zijn aan de hand van design principes',
      'Met een leaderboard en spellen trekken we de aandacht van bezoekers',
      'Hiermee hebben we nu de volgende gegevens over jou'
    ];
    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
  }

  provideRedText(): void {
    this.h1TextArray = [
      'Nu zijn we nieuwsgierig naar jou natuurlijk',
      'Dit is wat we nu kunnen',
    ];
    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
  }

  provideGreenText(): void {
    const userProfileName = this.userProfile?.name;

    this.h1TextArray = [
      'Eens kijken wat we kunnen vinden over jou',
      `Hallo ${userProfileName}`,
      ...(this.userProfile?.linkedIn || []),
      'Dit was erg makkelijk te vinden',
      'Wees altijd bewust van wat je openbaar hebt staan en wat voor gegevens je deelt',
    ];

    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
  }

  provideBlueText(): void {
    this.h1TextArray = [
      'Benieuwd hoe we dit gedaan hebben?',
    ];
    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
  }

  provideEndingText(): void {
    this.h1TextArray = [
      'Afsluiting'
    ];
    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
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
      this.openCurtain();
    }, 1000);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}
