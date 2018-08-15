import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
 
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
	private apiURL = 'http://localhost/virtualgrave/server/api/data';  

  constructor(private http: HttpClient) { }

	getAll (): Observable<any[]> {
		return this.http.get<any[]>(this.apiURL).pipe(
			catchError(this.handleError('getAll', []))
		);
  }
  
  getAllWithMethodAndOptions (method: string, options: string): Observable<any[]> {
		const url = `${this.apiURL}/${method}/${options}`;
    return this.http.get<any[]>(url).pipe(
			catchError(this.handleError('getAllWithMethodAndOptions', []))
		);
	}

	getNo404<Data>(id: number): Observable<any> {
		const url = `${this.apiURL}/?id=${id}`;
		return this.http.get<any[]>(url).pipe(
			map(data => data[0]), // returns a {0|1} element array
			tap(h => {
			  const outcome = h ? `fetched` : `did not find`;
			}),
			catchError(this.handleError<any>(`getany id=${id}`))
		);
	}

	get(id: number): Observable<any> {
		const url = `${this.apiURL}/${id}`;
		return this.http.get<any>(url).pipe(
		  catchError(this.handleError<any>(`get id=${id}`))
		);
  }
  
  getWithMethodAndOptions(method: string, options: string): Observable<any> {
		const url = `${this.apiURL}/${method}/${options}`;
		return this.http.get<any>(url).pipe(
		  catchError(this.handleError<any>(`getWithMethodAndOptions`))
		);
	}

	search(term: string): Observable<any[]> {
		if (!term.trim()) {
		  return of([]);
		}
		return this.http.get<any[]>(`${this.apiURL}/?name=${term}`).pipe(
		  catchError(this.handleError<any[]>('search', []))
		);
	}

	add(any: any): Observable<any> {
		let data = this.jsonToURLEncoded(any);
		return this.http.post<any>(this.apiURL, data, httpOptions).pipe(
		  catchError(this.handleError<any>('add'))
		);
	}
	
	createWithMethodAndOptions(options: any): Observable<any> {
		let data = this.jsonToURLEncoded(options);
		return this.http.post<any>(this.apiURL, data, httpOptions).pipe(
		  catchError(this.handleError<any>('createWithMethodAndOptions'))
		);
	}

	delete (any: any | number): Observable<any> {
		const id = typeof any === 'number' ? any : any.any_id;
		const url = `${this.apiURL}/${id}`;

		return this.http.delete<any>(url, httpOptions).pipe(
		  catchError(this.handleError<any>('delete'))
		);
	}

	update (any: any): Observable<any> {
		const url = `${this.apiURL}/${any.any_id}`;
		return this.http.put(url, any, httpOptions).pipe(
		  catchError(this.handleError<any>('update'))
		);
  }

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
