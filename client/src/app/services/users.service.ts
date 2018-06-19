import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './../classes/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {
	private apiURL = 'http://localhost/virtualgrave/server/api/users';  // URL to web api
	
	constructor(private http: HttpClient) { }
	
	getAll (): Observable<User[]> {
		return this.http.get<User[]>(this.apiURL).pipe(
			//map(heroes => {console.log(heroes);}),
			catchError(this.handleError('getAll', []))
		);
  }
  
  getWithMethodAndOptions (method: string, options: string): Observable<User[]> {
		const url = `${this.apiURL}/${method}/${options}`;
    return this.http.get<any[]>(url).pipe(
			catchError(this.handleError('getWithMethodAndOptions', []))
		);
	}

	getNo404<Data>(id: number): Observable<User> {
		const url = `${this.apiURL}/?id=${id}`;
		return this.http.get<User[]>(url).pipe(
			map(data => data[0]), // returns a {0|1} element array
			tap(h => {
			  const outcome = h ? `fetched` : `did not find`;
			}),
			catchError(this.handleError<User>(`getUser id=${id}`))
		);
	}

	get(id: number): Observable<User> {
		const url = `${this.apiURL}/${id}`;
		return this.http.get<User>(url).pipe(
		  catchError(this.handleError<User>(`get id=${id}`))
		);
	}

	search(term: string): Observable<User[]> {
		if (!term.trim()) {
		  return of([]);
		}
		return this.http.get<User[]>(`${this.apiURL}/?name=${term}`).pipe(
		  catchError(this.handleError<User[]>('search', []))
		);
	}

	add(User: User): Observable<User> {
		let data = this.jsonToURLEncoded(User);
		return this.http.post<User>(this.apiURL, data, httpOptions).pipe(
		  catchError(this.handleError<User>('add'))
		);
	}

	delete (User: User | number): Observable<User> {
		const id = typeof User === 'number' ? User : User.user_id;
		const url = `${this.apiURL}/${id}`;

		return this.http.delete<User>(url, httpOptions).pipe(
		  catchError(this.handleError<User>('delete'))
		);
	}

	update (User: User): Observable<any> {
		const url = `${this.apiURL}/${User.user_id}`;
		return this.http.put(url, User, httpOptions).pipe(
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
