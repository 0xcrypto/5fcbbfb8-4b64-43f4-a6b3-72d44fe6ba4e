import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Advertisement } from './../classes/advertisement';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable({
  providedIn: 'root'
})

export class AdvertisementService {
	private apiURL = 'http://localhost/virtualgrave/server/api/advertisement';  // URL to web api
	
	constructor(private http: HttpClient) { }
	
	getAll (): Observable<Advertisement[]> {
		return this.http.get<Advertisement[]>(this.apiURL).pipe(
			//map(heroes => {console.log(heroes);}),
			catchError(this.handleError('getAll', []))
		);
	}

	getNo404<Data>(id: number): Observable<Advertisement> {
		const url = `${this.apiURL}/?id=${id}`;
		return this.http.get<Advertisement[]>(url).pipe(
			map(data => data[0]), // returns a {0|1} element array
			tap(h => {
			  const outcome = h ? `fetched` : `did not find`;
			}),
			catchError(this.handleError<Advertisement>(`getAdvertisement id=${id}`))
		);
	}

	get(id: number): Observable<Advertisement> {
		const url = `${this.apiURL}/${id}`;
		return this.http.get<Advertisement>(url).pipe(
		  catchError(this.handleError<Advertisement>(`get id=${id}`))
		);
	}

	search(term: string): Observable<Advertisement[]> {
		if (!term.trim()) {
		  return of([]);
		}
		return this.http.get<Advertisement[]>(`${this.apiURL}/?name=${term}`).pipe(
		  catchError(this.handleError<Advertisement[]>('search', []))
		);
	}

	add(advertisement: Advertisement): Observable<Advertisement> {
		let data = this.jsonToURLEncoded(advertisement);
		return this.http.post<Advertisement>(this.apiURL, data, httpOptions).pipe(
		  catchError(this.handleError<Advertisement>('add'))
		);
	}

	delete (advertisement: Advertisement | number): Observable<Advertisement> {
		const id = typeof advertisement === 'number' ? advertisement : advertisement.id;
		const url = `${this.apiURL}/${id}`;

		return this.http.delete<Advertisement>(url, httpOptions).pipe(
		  catchError(this.handleError<Advertisement>('delete'))
		);
	}

	update (advertisement: Advertisement): Observable<any> {
		const url = `${this.apiURL}/${advertisement.id}`;
		return this.http.put(url, advertisement, httpOptions).pipe(
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
