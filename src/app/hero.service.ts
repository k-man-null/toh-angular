import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Hero } from './hero';


@Injectable({
  providedIn: 'root'
})

export class HeroService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  private heroesURL = 'http://127.0.0.1:3000/api/heroes';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesURL)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      )
  }

  getHero(id: string): Observable<Hero> {
    const url = `${this.heroesURL}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_=> this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero(hero: Hero): Observable<any>{
    console.log(hero)
    return this.http.put(this.heroesURL,hero,this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero._id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesURL,hero,this.httpOptions).pipe(
      tap((newHero:Hero)=> this.log(`added hero w/ id=${newHero._id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(id: string): Observable<Hero> {

    const url = `${this.heroesURL}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ =>this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );

  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()){
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesURL}/?name=${term}`).pipe(
      tap( x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}



