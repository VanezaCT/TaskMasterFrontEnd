import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

interface Task {
  id?:string
  titulo: string;
  descripcion: string;
  fecha_vencimiento: string;
  status: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private URL = 'http://127.0.0.1:8000/api/task';

  constructor(private httpClient: HttpClient) { }

  getTask(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.httpClient.get<any>(`${this.URL}`, { headers }).pipe(
    )
  }

  private getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('token',token);
    return token;
  }


  createTask(task: Task): Observable<any> {
    const token = this.getToken();
    if (!token) {
      console.error('No hay token disponible');
      return throwError(() => new Error('No hay token disponible'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.post<any>(this.URL, task, { headers }).pipe(
      catchError(error => {
        console.error('Error al crear tarea', error);
        return throwError(() => new Error('Error al crear tarea'));
      })
    );
}

  deleteTask(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.delete<any>(`${this.URL}/${id}`, { headers });
  }

  updateTask(id: number, updatedTask: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.httpClient.put(`${this.URL}/${id}`, updatedTask, { headers });
  }
}
