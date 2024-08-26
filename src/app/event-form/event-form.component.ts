import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { CountdownService } from '../countdown.service'

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="event-form">
      <div class="input-group">
        <label for="eventName">Title</label>
        <input
          id="eventName"
          [(ngModel)]="eventName"
          name="eventName"
          (change)="onInputChange()"
        />
      </div>
      <div class="input-group">
        <label for="endDate">Date</label>
        <input
          id="endDate"
          [(ngModel)]="endDate"
          name="endDate"
          type="date"
          (change)="onInputChange()"
        />
      </div>
    </div>
  `,
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent {
  eventName: string = ''
  endDate: string = ''

  constructor(private countdownService: CountdownService) {}

  onInputChange(): void {
    if (this.eventName && this.endDate) {
      this.countdownService.setEventName(this.eventName)
      this.countdownService.setEndDate(new Date(this.endDate))
    }
  }
}
