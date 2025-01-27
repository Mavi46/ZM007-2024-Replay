import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReplayService } from '../services/replay.service';
import { UserProfile } from '../interfaces/replay-data';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  userProfiles: UserProfile[] = [];
  isLoading = true;
  error: string | null = null;
  selectedProfile: UserProfile | null = null;
  showOverlay = false;

  constructor(private replayService: ReplayService, private router: Router) { }

  ngOnInit(): void {
    this.replayService.getAllUserProfiles().subscribe({
      next: (profiles) => {
        console.log(profiles);
        this.userProfiles = profiles;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user profiles:', err);
        this.error = 'Failed to load user profiles.';
        this.isLoading = false;
      }
    });

  }

  openOverlay(profile: UserProfile): void {
    this.selectedProfile = profile;
    this.showOverlay = true;
  }

  startReplay(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/replay'], { queryParams: { id } });
    } else {
      console.error('Cannot start replay: ID is undefined');
    }
  }

  closeOverlay(): void {
    this.showOverlay = false;
    this.selectedProfile = null;
  }

}
