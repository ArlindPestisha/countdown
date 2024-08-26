import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { CountdownDisplayComponent } from './countdown-display/countdown-display.component'
import { EventFormComponent } from './event-form/event-form.component'
import { CommonModule } from '@angular/common'

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, CountdownDisplayComponent, EventFormComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the app', () => {
    expect(component).toBeTruthy()
  })

  it(`should have as title 'natural-cycles-countdown'`, () => {
    expect(component.title).toEqual('natural-cycles-countdown')
  })

  it('should render CountdownDisplayComponent', () => {
    const countdownDisplay = fixture.debugElement.query(
      By.directive(CountdownDisplayComponent),
    )
    expect(countdownDisplay).toBeTruthy()
  })

  it('should render EventFormComponent', () => {
    const eventForm = fixture.debugElement.query(
      By.directive(EventFormComponent),
    )
    expect(eventForm).toBeTruthy()
  })

  it('should render CountdownDisplayComponent before EventFormComponent', () => {
    const elements = fixture.debugElement.queryAll(
      By.css('app-countdown-display, app-event-form'),
    )
    expect(elements.length).toBe(2)
    expect(elements[0].name).toBe('app-countdown-display')
    expect(elements[1].name).toBe('app-event-form')
  })

  it('should use standalone component', () => {
    expect(AppComponent.ɵcmp.standalone).toBeTrue()
  })

  it('should import necessary modules and components', () => {
    const imports = (AppComponent as any).__annotations__[0].imports
    expect(imports).toContain(CommonModule)
    expect(imports).toContain(CountdownDisplayComponent)
    expect(imports).toContain(EventFormComponent)
  })
})
