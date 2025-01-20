import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map, catchError } from 'rxjs';
import { UserProfile } from '../interfaces/replay-data';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  private apiUrl = 'http://localhost:3000/api/scraper';
  private profilesCache: UserProfile[] = [];

  constructor(private http: HttpClient) { }

  getAllUserProfiles(): Observable<UserProfile[]> {
    if (this.profilesCache.length > 0) {
      return of(this.profilesCache);
    }
    return this.fetchAllUserProfiles();
  }

  fetchAllUserProfiles(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl).pipe(
      tap((profiles) => {
        this.profilesCache = profiles;
      }),
      catchError((error) => {
        console.error('Fetching data failed. Using mock profile.', error);
        const mockProfile: UserProfile = {
          name: 'Reinier Geppaard',
          email: 'reinier@gmail.com',
          status: 'done',
          linkedIn: [
            'Oh, dus jij bent Reinier Geppaard, de student die al sinds zijn kindertijd geniet van het vereenvoudigen van processen om tijd te besparen? Geweldig!',
            'Dus, je streeft ernaar om processen en taken te automatiseren met machines of robots, terwijl je je vaardigheden in de IT-wereld blijft uitbreiden? Hoe verrassend en origineel!',
            'En daar ga je dan, Reinier Geppaard, met je inspiratie om processen te automatiseren, je carrièredoelen al vroeg in het leven vastgesteld en altijd op zoek naar nieuwe kennis in de IT-wereld. Wat een unieke persoonlijkheid!'
          ]
        };
        this.profilesCache = [mockProfile];
        return of([mockProfile]);
      })
    );
  }

  getUserProfileByIndex(index: number): Observable<UserProfile | null> {
    return this.getAllUserProfiles().pipe(
      map((profiles) => {
        if (index >= 0 && index < profiles.length) {
          return profiles[index];
        }
        return null;
      })
    );
  }
}
