import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { FooterMenu } from './../classes/footermenu';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable({
  providedIn: 'root'
})

export class FooterMenuService {
	private apiURL = 'http://localhost/virtualgrave/server/api/footermenu';  // URL to web api
	
	constructor(private http: HttpClient) { }
	
	getAll (): Observable<FooterMenu[]> {
		return this.http.get<FooterMenu[]>(this.apiURL).pipe(
			//map(heroes => {console.log(heroes);}),
			catchError(this.handleError('getAll', []))
		);
	}

	getNo404<Data>(id: number): Observable<FooterMenu> {
		const url = `${this.apiURL}/?id=${id}`;
		return this.http.get<FooterMenu[]>(url).pipe(
			map(data => data[0]), // returns a {0|1} element array
			tap(h => {
			  const outcome = h ? `fetched` : `did not find`;
			}),
			catchError(this.handleError<FooterMenu>(`getFooterMenu id=${id}`))
		);
	}

	get(id: number): Observable<FooterMenu> {
		const url = `${this.apiURL}/${id}`;
		return this.http.get<FooterMenu>(url).pipe(
		  catchError(this.handleError<FooterMenu>(`get id=${id}`))
		);
	}

	search(term: string): Observable<FooterMenu[]> {
		if (!term.trim()) {
		  return of([]);
		}
		return this.http.get<FooterMenu[]>(`${this.apiURL}/?name=${term}`).pipe(
		  catchError(this.handleError<FooterMenu[]>('search', []))
		);
	}

	add(FooterMenu: FooterMenu): Observable<FooterMenu> {
		let data = this.jsonToURLEncoded(FooterMenu);
		return this.http.post<FooterMenu>(this.apiURL, data, httpOptions).pipe(
		  catchError(this.handleError<FooterMenu>('add'))
		);
	}

	delete (FooterMenu: FooterMenu | number): Observable<FooterMenu> {
		const id = typeof FooterMenu === 'number' ? FooterMenu : FooterMenu.id;
		const url = `${this.apiURL}/${id}`;

		return this.http.delete<FooterMenu>(url, httpOptions).pipe(
		  catchError(this.handleError<FooterMenu>('delete'))
		);
	}

	update (FooterMenu: FooterMenu): Observable<any> {
		const url = `${this.apiURL}/${FooterMenu.id}`;
		return this.http.put(url, FooterMenu, httpOptions).pipe(
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
