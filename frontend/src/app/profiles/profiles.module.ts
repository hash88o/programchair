import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfilesRoutingModule } from './profiles-routing.module';
import { ProfileService } from './services/profile.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { interceptors } from '../shared/interceptors';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProfilesRoutingModule],
  providers: [
    ProfileService,
    provideHttpClient(withInterceptors(interceptors)),
  ],
})
export class ProfilesModule {}
