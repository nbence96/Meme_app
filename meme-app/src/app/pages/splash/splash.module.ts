import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SplashComponent } from './splash.component';
import { SplashRoutingModule } from './splash-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [SplashComponent],
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    SplashRoutingModule

  ],
  exports:[SplashComponent],
  entryComponents: [SplashComponent]
})
export class SplashModule { }
