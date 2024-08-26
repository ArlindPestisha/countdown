import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CountdownService } from '../countdown.service'
import { Subscription } from 'rxjs'
import { TextFitDirective } from '../text-fit.directive'

@Component({
  selector: 'app-countdown-display',
  standalone: true,
  imports: [CommonModule, TextFitDirective],
  template: `
    <div class="countdown-container">
      <h1 class="event-name" appTextFit [minFontSize]="24" [maxFontSize]="100">
        Time to {{ eventName }}
      </h1>
      <div class="countdown" appTextFit [minFontSize]="20" [maxFontSize]="80">
        {{ countdown }}
      </div>
    </div>
  `,
  styleUrls: ['./countdown-display.component.scss'],
})
export class CountdownDisplayComponent implements OnInit, OnDestroy {
  eventName: string = ''
  countdown: string = ''
  private subscriptions: Subscription[] = []

  constructor(private countdownService: CountdownService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.countdownService.getEventName().subscribe((name) => {
        this.eventName = name
      }),
      this.countdownService.getCountdown().subscribe((countdown) => {
        this.countdown = countdown
      }),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
