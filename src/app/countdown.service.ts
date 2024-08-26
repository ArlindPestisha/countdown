import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, interval } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private endDate = new BehaviorSubject<Date>(new Date())
  private eventName = new BehaviorSubject<string>('')

  constructor() {
    this.loadFromLocalStorage()
  }

  setEndDate(date: Date): void {
    this.endDate.next(date)
    this.saveToLocalStorage()
  }

  setEventName(name: string): void {
    this.eventName.next(name)
    this.saveToLocalStorage()
  }

  getCountdown(): Observable<string> {
    return interval(1000).pipe(map(() => this.calculateTimeRemaining()))
  }

  getEventName(): Observable<string> {
    return this.eventName.asObservable()
  }

  private calculateTimeRemaining(): string {
    const now = new Date()
    const diff = this.endDate.value.getTime() - now.getTime()

    if (diff <= 0) {
      return 'Event has passed'
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return `${days} days, ${hours} h, ${minutes} m, ${seconds} s`
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('endDate', this.endDate.value.toISOString())
    localStorage.setItem('eventName', this.eventName.value)
  }

  private loadFromLocalStorage(): void {
    const savedDate = localStorage.getItem('endDate')
    const savedName = localStorage.getItem('eventName')

    if (savedDate) {
      this.endDate.next(new Date(savedDate))
    }
    if (savedName) {
      this.eventName.next(savedName)
    }
  }
}
