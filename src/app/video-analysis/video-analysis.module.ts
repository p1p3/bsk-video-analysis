import { VideoAnalysisComponent } from './video-analysis.component';
import { BSChartsModule } from './../charts/bs-charts.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AccordionModule } from 'ng2-bootstrap/accordion';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { TooltipModule } from 'ng2-bootstrap/tooltip';

import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { IEmotionService } from './shared/services/def/emotions.service';
import { EmotionService } from './shared/services/emotions.service';

import { EmotionPreviewComponent } from './emotions-preview/emotion-preview.component';
import { SentimentsPreviewComponent } from './sentiments-preview/sentiments-preview.component';
import { PersonalityInsightsComponent } from './personality-insights/personality-insights.component';


@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    BSChartsModule,
    VgCoreModule,
    VgOverlayPlayModule,
    VgControlsModule,
    VgBufferingModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [EmotionPreviewComponent, VideoAnalysisComponent, SentimentsPreviewComponent, PersonalityInsightsComponent],
  exports: [VideoAnalysisComponent],
  providers: [{ provide: 'IEmotionService', useClass: EmotionService }]
})
export class VideoAnalysisModule { }