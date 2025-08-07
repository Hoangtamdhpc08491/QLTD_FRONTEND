import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  password?: string;
  name: string;
  email: string;
  phone: string;
  creditRating: 'excellent' | 'good' | 'average' | 'poor' | 'unknown';
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface SingleUserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  creditRating?: 'excellent' | 'good' | 'average' | 'poor' | 'unknown';
  role?: 'admin' | 'user';
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  name?: string;
  email?: string;
  phone?: string;
  creditRating?: 'excellent' | 'good' | 'average' | 'poor' | 'unknown';
  role?: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private http = inject(HttpClient);

  // Admin APIs - Quản lý người dùng (cần authentication)
  getAllUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/admin/users`);
  }

  getUserById(id: number): Observable<SingleUserResponse> {
    return this.http.get<SingleUserResponse>(`${this.apiUrl}/admin/users/${id}`);
  }

  createUser(userData: CreateUserRequest): Observable<SingleUserResponse> {
    return this.http.post<SingleUserResponse>(`${this.apiUrl}/admin/users/create`, userData);
  }

  updateUser(id: number, userData: UpdateUserRequest): Observable<SingleUserResponse> {
    return this.http.put<SingleUserResponse>(`${this.apiUrl}/admin/users/update/${id}`, userData);
  }

  deleteUser(id: number): Observable<{success: boolean; message: string}> {
    return this.http.delete<{success: boolean; message: string}>(`${this.apiUrl}/admin/users/delete/${id}`);
  }
}
