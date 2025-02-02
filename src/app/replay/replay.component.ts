import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TypewriterDirective } from '../directives/typewriter.directive';
import { UserProfile } from '../interfaces/replay-data';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplayService } from '../services/replay.service';
import { TimerBarComponent } from '../timer-bar/timer-bar.component';
import { CarouselModule } from 'primeng/carousel';


@Component({
  selector: 'app-replay',
  standalone: true,
  imports: [CommonModule, TypewriterDirective, TimerBarComponent, CarouselModule],
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
  // curtainColors = ['#5D275D', '#B13E53', '#00BA85', '#3B5DC9', '#FFCD75']; // Purple HCI, Red SE, Green DataE, Blue Security, Ending Yellow, (Ending)
  // curtainColors = ['#00BA85'];
  curtainColors: string[] = [];
  isLinkedInData: boolean = false;
  isFacebookData: boolean = false;
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

  // Screen HCI
  hciPopup: boolean = false;

  // Screen DE
  facebookDataString: string[] = [];
  facebookDataVisible: boolean = false;

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
              this.facebookDataString = profile.facebookData as string[];
              window.addEventListener('keydown', this.onKeyDown.bind(this));
              if (profile.linkedIn!.length > 0 || profile.facebookData!.length > 0) {
                this.curtainColors = ['#00BA85', '#5D275D', '#B13E53', '#3B5DC9', '#FFCD75'];
                // this.curtainColors = ['#FFCD75'];  
                if (profile.linkedIn!.length > 0) {
                  this.isLinkedInData = true;
                } if (profile.facebookData!.length > 0) {
                  this.isFacebookData = true;
                }
              } else {
                this.curtainColors = ['#5D275D', '#B13E53', '#00BA85', '#3B5DC9', '#FFCD75'];
              }
              this.curtainColor = this.curtainColors[this.currentColorIndex];
              // console.log(this.isFacebookData, this.isLinkedInData);
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
      } if (this.curtainColor === '#FFCD75') { // Yellow - Ending
        this.provideYellowText();
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
      // console.log('Lock, 2 seconden.');
      setTimeout(() => {
        this.controlsActive = true;
      }, 2000);
    } else {
      // console.log('Lock, 6 seconden.');
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
    } if (this.curtainColor === '#FFCD75') { // Yellow - Ending
      if (!this.screenElementsShowed) {
        this.controlLock(true);
        this.yellowNextElement();
      } else {
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
def start():
    while True:
        taak = checkDatabase()  # Zoek nieuwe taak
        if taak:
            link = zoekData(taak)  # Zoek Data
            downloadPagina(link)  # Download pagina
            data = verwerkPagina()  # Haal info uit pagina
            verhaal = maakVerhaal(data) # Maak verhaal van data
            slaOpInDatabase(data, taak)  # Sla op in database
            maakSchoon()  # Verwijder tijdelijke bestanden

def maakVerhaal(gevonden_data):
    prompt = "Geef 3 korte feitjes op basis van: " + gevonden_data
    response = vraagAI(prompt) # AI maakt verhaalvorm
    return response["inhoud"]

start()`;
      }, this.typedScriptName.length * 50);
      this.screenElementsShowed = true;
    }

  }

  greenNextElement(): void {
    // if (this.h1CurrentTextIndex < this.h1TextArray.length - 1) {
    //   this.h1State = 'out';
    //   setTimeout(() => {
    //     this.h1CurrentTextIndex++;
    //     this.h1RotationText = this.h1TextArray[this.h1CurrentTextIndex];
    //     this.h1State = 'in';

    //     // Check if it is the last element to set the flag
    //     if (this.h1CurrentTextIndex === this.h1TextArray.length - 1) {
    //       this.screenElementsShowed = true;
    //     }
    //   }, 500);

    // }

    if (this.h1CurrentTextIndex < this.h1TextArray.length - 1) {
      this.h1State = 'out';
      setTimeout(() => {
        this.h1CurrentTextIndex++;
        this.h1RotationText = this.h1TextArray[this.h1CurrentTextIndex];
        this.h1State = 'in';

        //Check if it is the last element to set the flag
        if (this.h1CurrentTextIndex === this.h1TextArray.length - 1) {

          if (this.isFacebookData) {
            this.h1State = 'out';
            this.h1RotationText = 'Ken jij deze mensen nog?';
            this.h1State = 'in';
            setTimeout(() => {
              this.facebookDataVisible = true;
            }, 1000);
          }
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

  yellowNextElement(): void {
    this.isPaused = false;
    if (this.h1CurrentTextIndex < this.h1TextArray.length - 1) {
      this.h1State = 'out';
      setTimeout(() => {
        this.h1CurrentTextIndex++;
        this.h1RotationText = this.h1TextArray[this.h1CurrentTextIndex];
        this.h1State = 'in';

        if (this.h1CurrentTextIndex === this.h1TextArray.length - 1) {
          this.screenElementsShowed = true;
        }
      }, 500);
    }
  }










  providePurpleText(): void {
    this.h1TextArray = [
      'Human-computer interaction (HCI) is een vakgebied binnen de informatiekunde dat zich bezighoudt met onderzoek naar de interactie (wisselwerking) tussen mensen (gebruikers) en machines (waaronder computers)',
      'Onze applicatie is ontworpen op basis van specifieke keuzes, gemaakt aan de hand van designprincipes',
      'We trokken je aandacht met een leaderboard en leuke spellen. En zonder dat je erbij stilstond, gaf je ons deze gegevens:',
    ];
    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
  }

  provideRedText(): void {
    this.h1TextArray = [
      'Software engineering is het vakgebied dat zich bezighoudt met het ontwikkelen van verschillende soorten applicaties die aansluiten op de behoeften van de opdrachtgever',
      'Ook wij hebben een eigen applicatie gebouwd en deze ziet er voor een deel zo uit:',
    ];
    this.h1RotationText = this.h1TextArray[0];
    this.h1State = 'in';
  }

  provideGreenText(): void {
    const userProfileName = this.userProfile?.name;


    this.h1TextArray = [
      'Data engineering is het vakgebied dat zich bezighoudt met het verzamelen, opslaan en analyseren van data',
      `Hallo ${userProfileName}`,
      ...(this.userProfile?.linkedIn?.length
        ? [
          ...this.userProfile.linkedIn,
          'Dit was erg makkelijk te vinden', //Alleen als je data hebt
        ]
        : ['Wij hebben geen gegevens over jou kunnen vinden', 'Blijkbaar heb jij je digitale voetafdruk goed op orde']), // Alleen als je geen data hebt
      'Wees altijd bewust van wat je openbaar hebt staan en welke gegevens je deelt', // Altijd getoond

      ...(this.userProfile?.qrScanned
        ? [
          'Het ziet er naar uit dat je na het spelen van het spel de QR-code hebt gescand', // Als qrScanned true is
          'Ook al bevind je je in een vertrouwde omgeving, wees altijd voorzichtig bij het scannen van een QR-code. Hackers kunnen deze codes misbruiken',
        ]
        : [
          'Het ziet er naar uit dat je na het spelen van het spel de QR-code niet hebt gescand', // Als qrScanned false is
          'Dat is een goede keuze, want je weet maar nooit wat er achter een QR-code verborgen zit'
        ]),

      // ...(this.userProfile?.facebookData?.length ? ['Ken jij deze mensen nog?'] : []), // Alleen als er Facebook data is
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

  provideYellowText(): void {
    this.h1TextArray = [
      'Dit was het einde van onze ICT-ervaring. Bedankt voor je deelname!',
      'We laten je weten of je een prijs hebt gewonnen. Houd je e-mail in de gaten voor meer informatie',
      'Als je meer wilt weten over dit project, stel gerust je vragen of bekijk de extra informatie',
      'Geen zorgen, je gegevens worden verwijderd nadat de prijsuitreiking heeft plaatsgevonden',
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
      this.curtainOpened = false;
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