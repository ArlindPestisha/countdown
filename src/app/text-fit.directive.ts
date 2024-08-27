import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
} from '@angular/core'
import { Subject, fromEvent } from 'rxjs'
import { debounceTime, takeUntil } from 'rxjs/operators'

@Directive({
  selector: '[appTextFit]',
  standalone: true,
})
export class TextFitDirective implements AfterViewInit, OnDestroy {
  @Input() minFontSize = 12
  @Input() maxFontSize = 100

  private destroy$ = new Subject<void>()
  private element: HTMLElement

  constructor(private el: ElementRef) {
    this.element = el.nativeElement
  }

  ngAfterViewInit() {
    this.fitText()
    this.setupResizeListener()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private setupResizeListener() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(200), takeUntil(this.destroy$))
      .subscribe(() => this.fitText())
  }

  private fitText() {
    let low = this.minFontSize
    let high = this.maxFontSize
    let mid: number

    this.element.style.whiteSpace = 'nowrap'

    while (low <= high) {
      mid = Math.floor((low + high) / 2)
      this.element.style.fontSize = `${mid}px`

      if (this.element.scrollWidth <= this.element.offsetWidth) {
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    this.element.style.fontSize = `${high}px`
    this.element.style.whiteSpace = 'normal'
  }
}
