import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';
import { UserProfile } from '../interfaces/replay-data';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  private apiUrl = 'http://localhost:3000/api/scraper';
  private profilesCache: UserProfile[] = [];

  constructor(private http: HttpClient) { }

  getAllUserProfiles(): Observable<UserProfile[]> {
    console.log('Get called.');
    if (this.profilesCache.length > 0) {
      return of(this.profilesCache);
    }
    return this.fetchAllUserProfiles();
  }

  fetchAllUserProfiles(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl).pipe(
      tap((profiles) => (this.profilesCache = profiles))
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
