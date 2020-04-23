import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Alignment, Character } from '../model/character.model';
import { LoggingService } from './logging.service';

@Injectable({ providedIn: 'root' })
export class CharactersService {
  private characters$: BehaviorSubject<Character[]> = new BehaviorSubject(null);

  constructor(private loggingService: LoggingService, private http: HttpClient) {}

  public addCharacter(character: Character): Observable<Character> {
    return this.http.post<Character>(`http://localhost:3000/api/v1/no-auth/characters`, character);
  }

  public fetchCharacters(alignment?: Alignment) {
    console.log(alignment);
    let params: HttpParams = new HttpParams();

    if (alignment) {
      params = params.append('alignment', alignment);
    }

    this.http
      .get<Character[]>('http://localhost:3000/api/v1/no-auth/characters', {
        params,
        headers: new HttpHeaders({ 'custom-flow-header': 'something' }),
      })
      .subscribe(
        (characters) => {
          this.characters$.next(characters);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  public updateCharacter(id: number, character: Character): Observable<Character> {
    return this.http.put<Character>(`http://localhost:3000/api/v1/no-auth/characters/${id}`, character);
  }

  public fetchCharacter(id: number): Observable<Character> {
    return this.http.get<Character>(`http://localhost:3000/api/v1/no-auth/characters/${id}`);
  }

  public deleteCharacter(id: number): Observable<Character> {
    return this.http
      .delete<Character>(`http://localhost:3000/api/v1/no-auth/characters/${id}`)
      .pipe(tap(() => this.fetchCharacters()));
  }

  get characters(): Observable<Character[]> {
    return this.characters$;
  }
}
