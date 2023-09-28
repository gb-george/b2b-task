import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DataElement } from '../../models/data.model';

@Component({
  selector: 'app-data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataDisplayComponent {
  @Input() dataElements: DataElement[];

  constructor() {}
  

  trackByItemId(index: number, item: DataElement): string {
    return item.id;
  }
}
