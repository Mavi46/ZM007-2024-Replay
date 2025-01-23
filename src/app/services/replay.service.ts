import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map, catchError } from 'rxjs';
import { UserProfile, ApiUserProfile } from '../interfaces/replay-data';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  private apiUrl = 'http://localhost:3000/api/scraper';
  private profilesCache: UserProfile[] = [];

  constructor(private http: HttpClient) { }

  getAllUserProfiles(): Observable<UserProfile[]> {
    if (this.profilesCache.length > 0) {
      return of(this.profilesCache.filter(profile => profile.status === 'done'));
    }
    return this.fetchAllUserProfiles();
  }

  fetchAllUserProfiles(): Observable<UserProfile[]> {
    return this.http.get<ApiUserProfile[]>(this.apiUrl).pipe(
      map((profiles) =>
        profiles
          .filter(profile => profile._id && profile.status === 'done')
          .map(profile => ({
            id: (typeof profile._id === 'object' ? profile._id?.$oid : profile._id) || 'unknown-id', // Gebruik 'unknown-id' als default
            name: profile.name,
            email: profile.email,
            status: profile.status,
            linkedIn: profile.linkedIn || [] // Zorg dat linkedIn altijd een array is
          }))
      ),
      tap((filteredProfiles) => {
        this.profilesCache = filteredProfiles; // Cache de gefilterde profielen
      }),
      catchError((error) => {
        console.error('Fetching data failed. Using mock profile.', error);
        const mockProfile: UserProfile = {
          id: '677fedaa81a039677db34a7a',
          name: 'Reinier Geppaard',
          email: 'reinier@gmail.com',
          status: 'done',
          linkedIn: [
            'Oh, dus jij bent Reinier Geppaard, de student die al sinds zijn kindertijd geniet van het vereenvoudigen van processen om tijd te besparen? Geweldig!',
            'Dus, je streeft ernaar om processen en taken te automatiseren met machines of robots, terwijl je je vaardigheden in de IT-wereld blijft uitbreiden? Hoe verrassend en origineel!',
            'En daar ga je dan, Reinier Geppaard, met je inspiratie om processen te automatiseren, je carrièredoelen al vroeg in het leven vastgesteld en altijd op zoek naar nieuwe kennis in de IT-wereld. Wat een unieke persoonlijkheid!'
          ]
        };
        this.profilesCache = [mockProfile]; // Cache alleen mock data
        return of([mockProfile]); // Retourneer mock data als Observable
      })
    );
  }

  getUserProfileById(id: string): Observable<UserProfile | null> {
    return this.getAllUserProfiles().pipe(
      map((profiles) => profiles.find(profile => profile.id === id) || null)
    );
  }




}
