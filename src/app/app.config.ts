import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { provideRouter } from '@angular/router'
import { FormsModule } from '@angular/forms'

import { routes } from './app.routes'
import { CountdownService } from './countdown.service'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule),
    CountdownService,
  ],
}
