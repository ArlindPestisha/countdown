import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms'
import { EventFormComponent } from './event-form.component'
import { CountdownService } from '../countdown.service'
import { By } from '@angular/platform-browser'

describe('EventFormComponent', () => {
  let component: EventFormComponent
  let fixture: ComponentFixture<EventFormComponent>
  let countdownServiceSpy: jasmine.SpyObj<CountdownService>

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CountdownService', [
      'setEventName',
      'setEndDate',
    ])

    await TestBed.configureTestingModule({
      imports: [EventFormComponent, FormsModule],
      providers: [{ provide: CountdownService, useValue: spy }],
    }).compileComponents()

    countdownServiceSpy = TestBed.inject(
      CountdownService,
    ) as jasmine.SpyObj<CountdownService>
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have empty initial values', () => {
    expect(component.eventName).toBe('')
    expect(component.endDate).toBe('')
  })

  it('should have two input fields', () => {
    const inputElements = fixture.debugElement.queryAll(By.css('input'))
    expect(inputElements.length).toBe(2)
  })

  it('should update eventName on input change', () => {
    const input = fixture.debugElement.query(By.css('#eventName')).nativeElement
    input.value = 'New Event'
    input.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    expect(component.eventName).toBe('New Event')
  })

  it('should update endDate on input change', () => {
    const input = fixture.debugElement.query(By.css('#endDate')).nativeElement
    input.value = '2023-12-31'
    input.dispatchEvent(new Event('input'))
    fixture.detectChanges()
    expect(component.endDate).toBe('2023-12-31')
  })

  it('should call onInputChange when eventName changes', () => {
    spyOn(component, 'onInputChange')
    const input = fixture.debugElement.query(By.css('#eventName')).nativeElement
    input.value = 'New Event'
    input.dispatchEvent(new Event('change'))
    fixture.detectChanges()
    expect(component.onInputChange).toHaveBeenCalled()
  })

  it('should call onInputChange when endDate changes', () => {
    spyOn(component, 'onInputChange')
    const input = fixture.debugElement.query(By.css('#endDate')).nativeElement
    input.value = '2023-12-31'
    input.dispatchEvent(new Event('change'))
    fixture.detectChanges()
    expect(component.onInputChange).toHaveBeenCalled()
  })

  it('should not call CountdownService methods when inputs are empty', () => {
    component.onInputChange()
    expect(countdownServiceSpy.setEventName).not.toHaveBeenCalled()
    expect(countdownServiceSpy.setEndDate).not.toHaveBeenCalled()
  })

  it('should call CountdownService methods when both inputs are filled', () => {
    component.eventName = 'Test Event'
    component.endDate = '2023-12-31'
    component.onInputChange()
    expect(countdownServiceSpy.setEventName).toHaveBeenCalledWith('Test Event')
    expect(countdownServiceSpy.setEndDate).toHaveBeenCalledWith(
      jasmine.any(Date),
    )
  })

  it('should have correct label texts', () => {
    const labels = fixture.debugElement.queryAll(By.css('label'))
    expect(labels[0].nativeElement.textContent).toContain('Title')
    expect(labels[1].nativeElement.textContent).toContain('Date')
  })

  it('should have correct input types', () => {
    const inputs = fixture.debugElement.queryAll(By.css('input'))
    expect(inputs[0].nativeElement.type).toBe('text')
    expect(inputs[1].nativeElement.type).toBe('date')
  })
})
