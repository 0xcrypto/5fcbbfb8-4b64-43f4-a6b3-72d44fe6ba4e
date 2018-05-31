import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { StaticPage } from './../classes/staticpage';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable({
  providedIn: 'root'
})
export class StaticPageService {
	private apiURL = 'http://localhost/virtualgrave/server/api/staticpage';  // URL to web api
	
	constructor(private http: HttpClient) { }
	
	getAll (): Observable<StaticPage[]> {
		return this.http.get<StaticPage[]>(this.apiURL).pipe(
			//map(heroes => {console.log(heroes);}),
			catchError(this.handleError('getAll', []))
		);
	}

	getNo404<Data>(id: number): Observable<StaticPage> {
		const url = `${this.apiURL}/?id=${id}`;
		return this.http.get<StaticPage[]>(url).pipe(
			map(data => data[0]), // returns a {0|1} element array
			tap(h => {
			  const outcome = h ? `fetched` : `did not find`;
			}),
			catchError(this.handleError<StaticPage>(`getStaticPage id=${id}`))
		);
	}

	get(id: number): Observable<StaticPage> {
		const url = `${this.apiURL}/${id}`;
		return this.http.get<StaticPage>(url).pipe(
		  catchError(this.handleError<StaticPage>(`get id=${id}`))
		);
	}

	search(term: string): Observable<StaticPage[]> {
		if (!term.trim()) {
		  return of([]);
		}
		return this.http.get<StaticPage[]>(`${this.apiURL}/?name=${term}`).pipe(
		  catchError(this.handleError<StaticPage[]>('search', []))
		);
	}

	add(StaticPage: StaticPage): Observable<StaticPage> {
		let data = this.jsonToURLEncoded(StaticPage);
		return this.http.post<StaticPage>(this.apiURL, data, httpOptions).pipe(
		  catchError(this.handleError<StaticPage>('add'))
		);
	}

	delete (StaticPage: StaticPage | number): Observable<StaticPage> {
		const id = typeof StaticPage === 'number' ? StaticPage : StaticPage.id;
		const url = `${this.apiURL}/${id}`;

		return this.http.delete<StaticPage>(url, httpOptions).pipe(
		  catchError(this.handleError<StaticPage>('delete'))
		);
	}

	update (StaticPage: StaticPage): Observable<any> {
		const url = `${this.apiURL}/${StaticPage.id}`;
		return this.http.put(url, StaticPage, httpOptions).pipe(
		  catchError(this.handleError<any>('update'))
		);
	}

	/**
	* Handle Http operation that failed.
	* Let the app continue.
	* @param operation - name of the operation that failed
	* @param result - optional value to return as the observable result
	*/
	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
		  console.error(error); 
		  return of(result as T);
		};
	}

	private jsonToURLEncoded(jsonString){
		return Object.keys(jsonString).map(function(key){
		  return encodeURIComponent(key) + '=' + encodeURIComponent(jsonString[key]);
		}).join('&');
	}

}
