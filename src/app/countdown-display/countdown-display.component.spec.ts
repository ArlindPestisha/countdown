import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { of } from 'rxjs'
import { CountdownDisplayComponent } from './countdown-display.component'
import { CountdownService } from '../countdown.service'
import { TextFitDirective } from '../text-fit.directive'

describe('CountdownDisplayComponent', () => {
  let component: CountdownDisplayComponent
  let fixture: ComponentFixture<CountdownDisplayComponent>
  let countdownServiceSpy: jasmine.SpyObj<CountdownService>

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CountdownService', [
      'getEventName',
      'getCountdown',
    ])

    await TestBed.configureTestingModule({
      imports: [CountdownDisplayComponent],
      providers: [{ provide: CountdownService, useValue: spy }],
    }).compileComponents()

    countdownServiceSpy = TestBed.inject(
      CountdownService,
    ) as jasmine.SpyObj<CountdownService>
  })

  beforeEach(() => {
    countdownServiceSpy.getEventName.and.returnValue(of('Test Event'))
    countdownServiceSpy.getCountdown.and.returnValue(
      of('10 days, 5 h, 30 m, 0 s'),
    )

    fixture = TestBed.createComponent(CountdownDisplayComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have empty initial values', () => {
    const freshComponent = new CountdownDisplayComponent(countdownServiceSpy)
    expect(freshComponent.eventName).toBe('')
    expect(freshComponent.countdown).toBe('')
  })

  it('should subscribe to countdownService on init', () => {
    expect(countdownServiceSpy.getEventName).toHaveBeenCalled()
    expect(countdownServiceSpy.getCountdown).toHaveBeenCalled()
  })

  it('should update eventName when service emits new value', () => {
    expect(component.eventName).toBe('Test Event')
  })

  it('should update countdown when service emits new value', () => {
    expect(component.countdown).toBe('10 days, 5 h, 30 m, 0 s')
  })

  it('should display eventName in the template', () => {
    const eventNameElement = fixture.debugElement.query(By.css('.event-name'))
    expect(eventNameElement.nativeElement.textContent).toContain(
      'Time to Test Event',
    )
  })

  it('should display countdown in the template', () => {
    const countdownElement = fixture.debugElement.query(By.css('.countdown'))
    expect(countdownElement.nativeElement.textContent).toContain(
      '10 days, 5 h, 30 m, 0 s',
    )
  })

  it('should apply TextFitDirective to event name', () => {
    const eventNameElement = fixture.debugElement.query(By.css('.event-name'))
    const directive = eventNameElement.injector.get(TextFitDirective)
    expect(directive).toBeTruthy()
  })

  it('should apply TextFitDirective to countdown', () => {
    const countdownElement = fixture.debugElement.query(By.css('.countdown'))
    const directive = countdownElement.injector.get(TextFitDirective)
    expect(directive).toBeTruthy()
  })

  it('should set correct min and max font sizes for event name', () => {
    const eventNameElement = fixture.debugElement.query(By.css('.event-name'))
    const directive = eventNameElement.injector.get(TextFitDirective)
    expect(directive.minFontSize).toBe(12)
    expect(directive.maxFontSize).toBe(100)
  })

  it('should set correct min and max font sizes for countdown', () => {
    const countdownElement = fixture.debugElement.query(By.css('.countdown'))
    const directive = countdownElement.injector.get(TextFitDirective)
    expect(directive.minFontSize).toBe(12)
    expect(directive.maxFontSize).toBe(80)
  })

  it('should unsubscribe from observables on destroy', () => {
    spyOn(component['subscriptions'][0], 'unsubscribe')
    spyOn(component['subscriptions'][1], 'unsubscribe')
    component.ngOnDestroy()
    expect(component['subscriptions'][0].unsubscribe).toHaveBeenCalled()
    expect(component['subscriptions'][1].unsubscribe).toHaveBeenCalled()
  })
})
