import { TextAnalytics } from './shared/models/text-analytics/text-analytics.model';
import { ITextAnalyticsService } from './shared/services/def/text-analytics.service';
import { Sentiment } from './shared/models/sentiment.model';
import { IInsightService } from './shared/services/def/insights.service';
import { TimeMarker } from './shared/models/time-marker.model';
import { Emotion } from './shared/models/emotion.model';
import { IEmotionService } from './shared/services/def/emotions.service';
import { Subject, Observable } from 'rxjs/Rx';
import { VgAPI } from 'videogular2/core';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
    selector: 'app-video-analysis',
    templateUrl: 'video-analysis.component.html',
    styleUrls: ['video-analysis.component.css']
})
export class VideoAnalysisComponent implements OnInit {
    public oneAtATime: boolean = true;

    private sources: Array<Object>;
    private api: VgAPI;
    private recordId = 'z4eee59e-f1ae-4882-9bbe-ee0c409c5ded';
    private currentTimeMarkerSource = new Subject<TimeMarker>();
    private currentTimeMarkersSource = new Subject<TimeMarker[]>();
    private markersSource = new Array<TimeMarker>();
    private timeMarkersObservable: Observable<TimeMarker[]>;
    private textAnalytics: TextAnalytics;

    private currentTimeMarker: TimeMarker;

    constructor( @Inject('IEmotionService') private emotionService: IEmotionService,
        @Inject('IInsightService') private insightService: IInsightService,
        @Inject('ITextAnalyticsService') private textAnayticsService: ITextAnalyticsService) {
        this.sources = [
            {
                src: 'http://static.videogular.com/assets/videos/videogular.mp4',
                type: 'video/mp4'
            },
            {
                src: 'http://static.videogular.com/assets/videos/videogular.ogg',
                type: 'video/ogg'
            },
            {
                src: 'http://static.videogular.com/assets/videos/videogular.webm',
                type: 'video/webm'
            }
        ];
    }

    ngOnInit() {
        this.fetchTimeMarkers(this.recordId);
        this.fetchTextAnalytics(this.recordId);
    }

    private fetchTimeMarkers(recordId: string) {
        this.timeMarkersObservable = this.emotionService.getRecordEmotions(recordId);
        this.timeMarkersObservable.subscribe(timeMarkers => {
            this.markersSource = timeMarkers;
            this.markersSource.sort((a, b) => a.startTime - b.startTime);
        });
    }

    private fetchTextAnalytics(recordId: string) {
        this.textAnayticsService.getRecordTextAnalytics(recordId).subscribe(analytics => {
            this.textAnalytics = analytics;
        });
    }

    onPlayerReady(api: VgAPI) {
        this.api = api;
        this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(time => {
            let currentTime = this.api.getDefaultMedia().currentTime;

            let timeMarkerResult = this.markersSource.find(timeMarker => this.isCurrentTimeInTimeMarkerInRange(currentTime, timeMarker));

            if (timeMarkerResult && (this.isNotBeingDisplayed(timeMarkerResult) || (!this.isNotNull(this.currentTimeMarker)))) {
                this.currentTimeMarkerSource.next(timeMarkerResult);
                let timeMarkersSpan = this.markersSource.filter(timeMarker =>
                    this.timeMarkerInVideoRange(currentTime, timeMarker));
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
        this.api.getDefaultMedia().currentTime = marker.startTime;
    }

    private getEmptyTimeMarker() {
        let emptyEmotion = new Emotion(0, 0, 0, 0, 0, 0, 0, 0);
        let emptySentiment = new Sentiment(0);
        let timeMarker = new TimeMarker('', 0, 0, emptyEmotion, emptySentiment, '');
        return timeMarker;
    }

}
