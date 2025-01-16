import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TypewriterDirective } from '../directives/typewriter.directive';
import { UserProfile } from '../interfaces/replay-data';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplayService } from '../services/replay.service';

@Component({
  selector: 'app-replay',
  standalone: true,
  imports: [CommonModule, TypewriterDirective],
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
  //curtainColors = ['#5D275D', '#B13E53', '#00BA85', '#3B5DC9', '#FFCD75', '#29366F']; // Paars HCI, Rood SE, Groen DataE, Blauw Security, Geel Afsluiting, Extra scherm
  curtainColors = ['#FFCD75']; // Paars HCI, Rood SE, Groen DataE, Blauw Security, Geel Afsluiting
  currentColorIndex = 0;
  curtainColor = this.curtainColors[this.currentColorIndex];
  nextCurtainColor = this.curtainColors[this.currentColorIndex];
  curtainOpened = false;

  // Titel rotatie
  h1RotationText: string = '';
  h1State = 'in';

  //User Profile
  userProfile!: UserProfile | null;

  // Scherm HCI
  hciPopup: boolean = false;

  // Scherm SE
  typedScriptName: string = '';
  typedScriptContent: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private replayService: ReplayService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = +params['id'];

      if (!isNaN(id)) {
        // Haal de data asynchroon op en sla het in userProfile op
        this.replayService.getUserProfileByIndex(id).subscribe({
          next: (profile) => {
            if (profile) {
              this.userProfile = profile;
              window.addEventListener('keydown', this.onKeyDown.bind(this));
              this.startAnimationCycle();
            } else {
              // Geen geldig profiel; navigeer eventueel terug
              this.router.navigate(['/']);
            }
          },
          error: (err) => {
            console.error('Fout bij ophalen profiel:', err);
            this.router.navigate(['/']);
          }
        });
      } else {
        // Als id geen getal is
        this.router.navigate(['/']);
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space' || event.key === ' ') {
      event.preventDefault();
      this.h1RotationText = 'Op de spatiebalk geklikt!';
    }
  }

  startAnimationCycle(): void {
    this.openCurtains();
    // this.curtainOpened = true;
  }

  openCurtains(): void {
    setTimeout(() => {
      this.curtainOpened = true;
      this.curtainColor = this.curtainColors[this.currentColorIndex];
      if (this.curtainColor === '#5D275D') {
        this.handlePurpleTextChange();
        setTimeout(() => this.hciPopup = true, 20000);
      } else if (this.curtainColor === '#B13E53') {
        this.handleRedTextchange();
      } else if (this.curtainColor === '#00BA85') {
        this.handleGreenTextChange();
      } else if (this.curtainColor === '#3B5DC9') {
        this.handleBlueTextChange();
      } else if (this.curtainColor === '#FFCD75') {
        this.handleYellowTextChange();
      } else if (this.curtainColor === '#29366F') {
        this.handleEXTextChange();
      }


      setTimeout(() => this.closeCurtains(), 30000);
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
      'Mens-computerinteractie (MCI) is een vakgebied binnen de informatiekunde dat zich bezighoudt met onderzoek naar de interactie (wisselwerking) tussen mensen (gebruikers) en machines (waaronder computers)',
      'Onze applicatie is ontworpen waarbij specifieke keuzes gemaakt zijn aan de hand van design principes',
      'Met een leaderboard en spellen trekken we de aandacht van bezoekers',
      'Hiermee hebben we nu de volgende gegevens over jou'
    ];
    this.startTextRotation(purpleTexts);
  }

  handleRedTextchange(): void {
    const redTexts = [
      'Software Engineering',
      'Nu kunnen we dit',
    ];

    this.startTextRotation(redTexts);

    // Bereken de tijd voor de tekstrotatie om te starten met de typewriting
    const rotationDuration = 3500 * redTexts.length; // 3500ms per tekst
    setTimeout(() => {
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
    }, rotationDuration); // Start de typewriting na de tekstrotatie
  }

  handleGreenTextChange(): void {
    const userProfileName = this.userProfile?.name;
    const text1 = this.userProfile?.text1;
    const text2 = this.userProfile?.text2;
    const text3 = this.userProfile?.text3;

    const greenTexts = [
      'Eens kijken wat we kunnen vinden over jou',
      `Hallo ${userProfileName || 'gast'}`,
      `${text1}`,
      `${text2}`,
      `${text3}`,
    ];
    this.startTextRotation(greenTexts);
  }

  handleBlueTextChange(): void {
    const blueTexts = [
      'Blue 1',
      'Blue 2',
    ];

    this.startTextRotation(blueTexts);
  }

  handleYellowTextChange(): void {
    const yellowTexts = [
      'Dit was het einde van onze ICT-ervaring. Bedankt voor je deelname!',
      'We houden je op de hoogte als je een prijs gewonnen hebt. Houd je e-mail in de gaten voor meer informatie.',
      'Neem gerust een kijkje bij de andere projecten die hier te zien zijn en stel je vragen als je meer wilt weten!',
    ];

    this.startTextRotation(yellowTexts);
  }

  handleEXTextChange(): void {
    const exTexts = [
      'tekst extra scherm',
      'tekst extra scherm',
    ];

    this.startTextRotation(exTexts);
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
    }, 5000);
  }







  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
  }
}
