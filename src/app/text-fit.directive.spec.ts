import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing'
import { Component, DebugElement } from '@angular/core'
import { TextFitDirective } from './text-fit.directive'
import { By } from '@angular/platform-browser'

@Component({
  template: `<div appTextFit [minFontSize]="minSize" [maxFontSize]="maxSize">
    Test Content
  </div>`,
})
class TestComponent {
  minSize = 12
  maxSize = 100
}

describe('TextFitDirective', () => {
  let component: TestComponent
  let fixture: ComponentFixture<TestComponent>
  let divElement: HTMLElement
  let directive: TextFitDirective

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [TextFitDirective],
    }).compileComponents()

    fixture = TestBed.createComponent(TestComponent)
    component = fixture.componentInstance
    divElement = fixture.nativeElement.querySelector('div')

    const directiveEl = fixture.debugElement.query(
      By.directive(TextFitDirective),
    )
    directive = directiveEl.injector.get(TextFitDirective)
  })

  it('should create an instance', () => {
    expect(directive).toBeTruthy()
  })

  it('should respect min and max font size', () => {
    component.minSize = 20
    component.maxSize = 30
    fixture.detectChanges()

    const fontSize = parseInt(divElement.style.fontSize, 10)
    expect(fontSize).toBeGreaterThanOrEqual(20)
    expect(fontSize).toBeLessThanOrEqual(30)
  })

  it('should adjust font size on window resize', fakeAsync(() => {
    fixture.detectChanges()
    const initialFontSize = divElement.style.fontSize
    console.log('Initial font size:', initialFontSize)

    Object.defineProperties(divElement, {
      offsetWidth: { configurable: true, get: () => 500 },
      offsetHeight: { configurable: true, get: () => 100 },
      scrollWidth: { configurable: true, get: () => 600 },
      scrollHeight: { configurable: true, get: () => 120 },
    })

    const fitTextSpy = spyOn(directive as any, 'fitText').and.callThrough()

    window.dispatchEvent(new Event('resize'))

    tick(200)

    fixture.detectChanges()

    console.log('fitText called:', fitTextSpy.calls.count())

    const newFontSize = divElement.style.fontSize
    console.log('New font size:', newFontSize)

    expect(fitTextSpy).toHaveBeenCalled()
    expect(newFontSize).not.toBe(initialFontSize)
    expect(parseInt(newFontSize)).toBeLessThan(parseInt(initialFontSize))

    discardPeriodicTasks()
  }))

  it('should clean up on destroy', () => {
    spyOn(directive['destroy$'], 'next')
    spyOn(directive['destroy$'], 'complete')

    directive.ngOnDestroy()

    expect(directive['destroy$'].next).toHaveBeenCalled()
    expect(directive['destroy$'].complete).toHaveBeenCalled()
  })
})
