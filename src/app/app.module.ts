import { CoreModule } from './core/core.module';
import { VideoAnalysisModule } from './video-analysis/video-analysis.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CoreModule,
    VideoAnalysisModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }