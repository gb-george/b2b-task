import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { DataService } from './services/data.service';
import { DataElement } from './models/data.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  dataElements!: DataElement[];
  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataService.generateNewData();
  }

  ngOnInit(): void {
    this.dataService.shortLisAdditionalIds$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.dataElements = data;
        this.cdr.detectChanges();
      });
  }

  onMillisecondsChange(value: number): void {
    this.dataService.changeInterval(value);
  }

  onArraySizeChange(value: number): void {
    this.dataService.onArraySizeChange(value);
  }

  onAdditionalNumberChange(value: number[]): void {
    this.dataService.changeSpecifiedIds(value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
