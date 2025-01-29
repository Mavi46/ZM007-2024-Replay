import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map, catchError } from 'rxjs';
import { UserProfile, ApiUserProfile } from '../interfaces/replay-data';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  // private apiUrl = 'http://localhost:3000/api/scraper';
  private apiUrl = 'http://10.0.1.14:3000/api/scraper';
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
            linkedIn: profile.linkedIn || [],
            qrScanned: profile.qrScanned,
            facebookData: profile.facebookData || [],
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
          ],
          qrScanned: true,
          facebookData: ["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",]
        };
        const mockProfile2: UserProfile = {
          id: '998877aa81b048899cd56b7b',
          name: 'Alex P',
          email: 'alexp@example.com',
          status: 'done',
          linkedIn: [],
          qrScanned: false,
          mailClicked: false,
        };
        this.profilesCache = [mockProfile, mockProfile2]; // Cache alleen mock data
        return of([mockProfile, mockProfile2]); // Retourneer mock data als Observable
      })
    );
  }

  getUserProfileById(id: string): Observable<UserProfile | null> {
    return this.getAllUserProfiles().pipe(
      map((profiles) => profiles.find(profile => profile.id === id) || null)
    );
  }




}
