import { ITextAnalyticsService } from '../shared/services/def/text-analytics.service';
import { Sentiment } from '../shared/models/sentiment.model';
import { IInsightService } from '../shared/services/def/insights.service';
import { TimeMarker } from '../shared/models/time-marker.model';
import { Emotion } from '../shared/models/emotion.model';
import { IEmotionService } from '../shared/services/def/emotions.service';
import { Subject, Observable } from 'rxjs/Rx';
import { VgAPI } from 'videogular2/core';
import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-real-time-analysis',
  templateUrl: './real-time-analysis.component.html',
  styleUrls: ['./real-time-analysis.component.css']
})
export class RealTimeAnalysisComponent implements OnInit {
  public oneAtATime: boolean = false;

  private sources: Array<Object>;
  private api: VgAPI;
  private recordId = 'f0b40320-a73a-43d6-acd1-dadc4eb6f2d6';
  private currentTimeMarkerSource = new Subject<TimeMarker>();
  private currentTimeMarkersSource = new Subject<TimeMarker[]>();
  private markersSource = new Array<TimeMarker>();
  private timeMarkersObservable: Observable<TimeMarker[]>;

  private currentTimeMarker: TimeMarker;

  constructor( @Inject('IEmotionService') private emotionService: IEmotionService,
    private route: ActivatedRoute, ) {
    this.sources = [
      // {
      //   src: 'http://bskamsdev.streaming.mediaservices.windows.net/2d295f86-ce23-4f18-b6f4-4b694b7ee601/s12240135_428x240_428.mp4',
      //   type: 'video/mp4'
      // },


      //0cfffe55-d725-45a7-8bed-a322f1caa303
      // {
      //   src: 'http://bskamsdev.streaming.mediaservices.windows.net/0b51898e-1a24-4b6c-b1aa-25efac642072/Nat_1920x1080_6750.mp4',
      //   type: 'video/mp4'
      // },
      //cad2b5fc-7870-4694-8aa3-d4cc7f68470d
      // {
      //   src: 'http://bskamsdev.streaming.mediaservices.windows.net/85c8f6eb-8c8b-49ef-a3f4-5a5d3675c2fe/WIN_20170112_19_17_16_Pro_960x540_1500.mp4',
      //   type: 'video/mp4'
      // },
      //f0b40320-a73a-43d6-acd1-dadc4eb6f2d6
      {
        src: 'http://bskamsdev.streaming.mediaservices.windows.net/5382e90b-84a7-44b0-8000-ba81d84a7cd2/Justin%20Hill%20Test%20Demo_640x360_1000.mp4',
        type: 'video/mp4'

      }
    ];

    // let asd;
    // this.route.params
    //   .switchMap((params: Params) => {
    //     debugger;
    //     asd = +params['id'];
    //     return asd;
    //   });
  }

  ngOnInit() {
    this.fetchTimeMarkers(this.recordId);
  }

  private fetchTimeMarkers(recordId: string) {
    this.timeMarkersObservable = this.emotionService.getRecordEmotions(recordId);
    this.timeMarkersObservable.subscribe(timeMarkers => {
      this.markersSource = timeMarkers;
      this.markersSource.sort((a, b) => a.startTime - b.startTime);
    });
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(time => {
      let currentTime = this.api.getDefaultMedia().currentTime;

      let timeMarkerResult = this.markersSource.find(timeMarker => this.isCurrentTimeInTimeMarkerInRange(currentTime, timeMarker));

      if (timeMarkerResult && (this.isNotBeingDisplayed(timeMarkerResult) || (!this.isNotNull(this.currentTimeMarker)))) {
        this.currentTimeMarkerSource.next(timeMarkerResult);
        let timeMarkersSpan = this.markersSource.filter(timeMarker => this.timeMarkerInVideoRange(currentTime, timeMarker));
        this.currentTimeMarkersSource.next(timeMarkersSpan);
      }
    });
  }

  isCurrentTimeInTimeMarkerInRange(currentTime: number, timeMarker: TimeMarker): boolean {
    return (currentTime >= timeMarker.startTime && currentTime <= timeMarker.endTime);
  }

  timeMarkerInVideoRange(currentTime: number, timeMarker: TimeMarker): boolean {
    return (currentTime >= timeMarker.startTime);
  }

  isNotNull(obj: any): boolean {
    return obj;
  }

  isNotBeingDisplayed(timeMarker: TimeMarker): boolean {
    return this.currentTimeMarker !== timeMarker;
  }


  get currentMarkerObservable(): Observable<TimeMarker> {
    return this.currentTimeMarkerSource
      .asObservable().startWith(this.getEmptyTimeMarker());
  }

  get currentMarkerersObservable(): Observable<TimeMarker[]> {
    return this.currentTimeMarkersSource
      .asObservable().startWith([this.getEmptyTimeMarker()]);
  }


  // tslint:disable-next-line:no-unused-variable
  private selectMarker(marker: TimeMarker) {
    let player = this.api.getDefaultMedia();
    player.currentTime = marker.startTime;
    player.play();
  }

  private getEmptyTimeMarker() {
    let emptyEmotion = new Emotion(0, 0, 0, 0, 0, 0, 0, 0);
    let emptySentiment = new Sentiment(0);
    let timeMarker = new TimeMarker('', 0, 0, emptyEmotion, emptySentiment, '');
    return timeMarker;
  }


}
