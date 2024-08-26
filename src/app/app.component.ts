import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CountdownDisplayComponent } from './countdown-display/countdown-display.component'
import { EventFormComponent } from './event-form/event-form.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CountdownDisplayComponent, EventFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'natural-cycles-countdown'
  static ɵcmp: any
}
