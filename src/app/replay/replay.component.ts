import { Component } from '@angular/core';
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

  // Timer
  timerDuration: number = 10000; // Seconds per element
  timeRemaining: number = this.timerDuration;
  timerInterval: any = null;
  isPaused: boolean = false;

  //User Profile
  userProfile!: UserProfile | null;

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
      const id = +params['id'];

      if (!isNaN(id)) {
        // Getting data async and creating userProfile
        this.replayService.getUserProfileByIndex(id).subscribe({
          next: (profile) => {
            if (profile) {
              this.userProfile = profile;
              window.addEventListener('keydown', this.onKeyDown.bind(this));
              this.openCurtain();
            } else {
              // No valid profile; navigate back to home
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            console.error('Error loading userProfile: ', err);
            this.router.navigate(['/']);
          }
        });
      } else {
        // When id is not a valid type
        this.router.navigate(['/']);
      }
    });
  }

  openCurtain(): void {
    setTimeout(() => {
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

  // onKeyDown(event: KeyboardEvent): void {
  //   if (event.code === 'Space' || event.key === ' ') {
  //     event.preventDefault();
  //     this.nextAction();
  //   }
  // }

  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
      this.isPaused = !this.isPaused;
    } else if (event.code === 'ArrowRight') {
      event.preventDefault();
      this.nextAction();
    }
  }

  nextAction(): void {
    if (this.curtainColor === '#5D275D') { // Purple - HCI
      if (!this.screenElementsShowed) {
        this.purpleNextElement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
        this.closeCurtains();
      }
    } if (this.curtainColor === '#B13E53') { // Red - SE
      if (!this.screenElementsShowed) {
        this.redNextElement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
        this.closeCurtains();
      }
    } if (this.curtainColor === '#00BA85') { // Green - DE
      if (!this.screenElementsShowed) {
        this.greenNextElement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
        this.closeCurtains();
      }
    } if (this.curtainColor === '#3B5DC9') { // Blue - Security
      if (!this.screenElementsShowed) {
        this.blueNextElement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
        this.closeCurtains();
      }
    } if (this.curtainColor === '#29366F') { // Ending
      if (!this.screenElementsShowed) {
        this.endingNextelement();
      } else {
        this.screenElementsShowed = false;
        this.h1CurrentTextIndex = 0;
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
      'Human-computer interaction (HCI) is een vakgebied binnen de informatiekunde dat zich bezighoudt met onderzoek naar de interactie (wisselwerking) tussen mensen (gebruikers) en machines (waaronder computers)',
      'Onze applicatie is ontworpen op basis van specifieke keuzes die zijn gemaakt aan de hand van designprincipes',
      'Met een leaderboard en spellen trekken wij de aandacht van bezoekers',
      'Hiermee hebben wij nu de volgende gegevens over jou:'
    ];
    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
  }

  provideRedText(): void {
    this.h1TextArray = [
      'Software engineering is het vakgebied dat zich bezighoudt met het ontwikkelen van verschillende soorten applicaties die aansluiten op de behoeften van de gebruiker',
      'Dit is wat wij met de ontvangen gegevens kunnen maken',
    ];
    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
  }

  provideGreenText(): void {
    const userProfileName = this.userProfile?.name;

    this.h1TextArray = [
      'Data engineering is het vakgebied dat zich bezighoudt met het verzamelen, opslaan en analyseren van data',
      'Eens kijken wat wij kunnen vinden over jou met de gegeven persoonsgegevens',
      `Hallo ${userProfileName}`,
      ...(this.userProfile?.linkedIn?.length
        ? [
          ...this.userProfile.linkedIn,
          'Dit was erg makkelijk te vinden', //Alleen als je data hebt
          ]
        : ['... Helaas','Wij hebben geen informatie over jou kunnen vinden', 'Blijkbaar heb jij je digitale voetafdruk goed op orde']), // Alleen als je geen data hebt
      'Wees altijd bewust van wat je openbaar hebt staan en welke gegevens je deelt', // Altijd getoond

      'Het ziet er naar uit dat je na het spelen van het spel de QR-code hebt gescand', //if Ja
      'Het ziet er naar uit dat je na het spelen van het spel niet de QR-code hebt gescand', //if Nee
      'Dat is een goede keuze, want je weet nooit wat er achter een QR-code zit', //if Nee
      'Dit zou zomaar eens een link kunnen zijn die niet veilig is', //if Ja
      'Wees altijd bewust van welke links je opent', //Altijd getoond
    ];

    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
  }

  provideBlueText(): void {
    this.h1TextArray = [
      'Security & Cloud is het vakgebied dat zich bezighoudt met het beveiligen van data en applicaties in de cloud zodat gebruikers veilig met de applicaties kunnen werken',
      'Benieuwd hoe wij dit gedaan hebben?',
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
