import { TestBed, fakeAsync, tick } from '@angular/core/testing'
import { CountdownService } from './countdown.service'
import { take } from 'rxjs/operators'

describe('CountdownService', () => {
  let service: CountdownService
  let localStorageMock: { [key: string]: string } = {}

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(CountdownService)

    localStorageMock = {}
    spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => localStorageMock[key],
    )
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => (localStorageMock[key] = value),
    )
  })

  afterEach(() => {
    try {
      jasmine.clock().uninstall()
    } catch (e) {
    }
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should set end date', fakeAsync(() => {
    const testDate = new Date(Date.now() + 10000)
    service.setEndDate(testDate)

    service
      .getCountdown()
      .pipe(take(1))
      .subscribe((countdown) => {
        expect(countdown).not.toBe('Event has passed')
      })

    tick(1000)
  }))

  it('should set event name', (done) => {
    const testName = 'Test Event'
    service.setEventName(testName)
    service
      .getEventName()
      .pipe(take(1))
      .subscribe((name) => {
        expect(name).toBe(testName)
        done()
      })
  })

  it('should return countdown as observable', fakeAsync(() => {
    jasmine.clock().install()
    const futureDate = new Date(Date.now() + 10000)
    service.setEndDate(futureDate)

    service
      .getCountdown()
      .pipe(take(1))
      .subscribe((countdown) => {
        expect(countdown).toMatch(/\d+ days, \d+ h, \d+ m, \d+ s/)
      })

    tick(1000)
  }))

  it('should return "Event has passed" when end date is in the past', fakeAsync(() => {
    const pastDate = new Date(Date.now() - 10000)
    service.setEndDate(pastDate)

    service
      .getCountdown()
      .pipe(take(1))
      .subscribe((countdown) => {
        expect(countdown).toBe('Event has passed')
      })

    tick(1000)
  }))

  it('should save to localStorage when setting end date', () => {
    const testDate = new Date('2023-12-31')
    service.setEndDate(testDate)
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'endDate',
      testDate.toISOString(),
    )
  })

  it('should save to localStorage when setting event name', () => {
    const testName = 'Test Event'
    service.setEventName(testName)
    expect(localStorage.setItem).toHaveBeenCalledWith('eventName', testName)
  })

  it('should load from localStorage on initialization', fakeAsync(() => {
    const testDate = new Date(Date.now() + 10000).toISOString()
    const testName = 'Test Event'
    localStorageMock['endDate'] = testDate
    localStorageMock['eventName'] = testName

    service = new CountdownService()

    expect(localStorage.getItem).toHaveBeenCalledWith('endDate')
    expect(localStorage.getItem).toHaveBeenCalledWith('eventName')

    service
      .getEventName()
      .pipe(take(1))
      .subscribe((name) => {
        expect(name).toBe(testName)
      })

    service
      .getCountdown()
      .pipe(take(1))
      .subscribe((countdown) => {
        expect(countdown).not.toBe('Event has passed')
      })

    tick(1000)
  }))

  it('should calculate time remaining correctly', fakeAsync(() => {
    jasmine.clock().install()
    jasmine.clock().mockDate(new Date('2023-01-01T00:00:00.000Z'))

    const futureDate = new Date('2023-01-02T01:01:01.000Z') // 1 day, 1 hour, 1 minute, 1 second
    service.setEndDate(futureDate)

    service
      .getCountdown()
      .pipe(take(1))
      .subscribe((countdown) => {
        expect(countdown).toBe('1 days, 1 h, 1 m, 1 s')
      })

    tick(1000)
  }))
})
