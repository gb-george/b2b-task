import { Injectable } from '@angular/core';
import { DataElement } from './../models/data.model';
import { BehaviorSubject, Observable, Subject, combineLatest, map } from 'rxjs';

export interface DataOptions {
  interval: number;
  dataSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private maxDisplaySize: number = 10;
  defaultDataOptions: DataOptions = {
    interval: 1000,
    dataSize: 1000,
  };

  private _listOptionsSubject = new BehaviorSubject<DataOptions>(this.defaultDataOptions);
  listOptions$ = this._listOptionsSubject.asObservable();

  private _additionalIDsSubject = new BehaviorSubject<number[]>([]);
  specifiedIds$ = this._additionalIDsSubject.asObservable();

  private listSubject = new Subject<DataElement[]>();
  list$: Observable<DataElement[]> = this.listSubject.asObservable();

  shortLisAdditionalIds$: Observable<DataElement[]> = combineLatest([
    this.list$,
    this.specifiedIds$,
  ]).pipe(
    map(([list, specifiedIds]: [DataElement[], number[]]) =>
      this.generateShortListAdditionalIDs(list, specifiedIds)
    )
  );

  private worker!: Worker;

  constructor() {
    this.worker = this.createWorker();
    this.worker.onmessage = ({ data }: { data: DataElement[] }) =>
      this.listSubject.next(data);
  }

  createWorker(): Worker {
    return new Worker(new URL('../app.worker.ts', import.meta.url));
  }

  generateNewData() {
    this.worker.postMessage({
      action: 'fetchData',
      options: this._listOptionsSubject.value,
    });
  }

  generateShortListAdditionalIDs(
    list: DataElement[],
    specifiedIds: number[]
  ): DataElement[] {
    // If specifiedIds is empty return the last 10 elements
    if (!specifiedIds || specifiedIds.length === 0) {
      return list.slice(-this.maxDisplaySize);
    }

    const specifiedIdsSet = new Set(specifiedIds);

    // finds elements with specified IDs from the list
    const elementsWithSpecifiedIds = [];
    for (let i = list.length - 1; i >= 0; i--) {
      const element = list[i];
      if (specifiedIdsSet.has(+element.id)) {
        elementsWithSpecifiedIds.unshift(element);
        if (elementsWithSpecifiedIds.length >= specifiedIds.length) {
          break;
        }
      }
    }

    // if not enough specified IDs, fill the remaining positions with the last elements from the original list
    const remainingElements = list.slice(
      -this.maxDisplaySize + elementsWithSpecifiedIds.length
    );

    const updatedList = [...elementsWithSpecifiedIds, ...remainingElements];

    return updatedList.slice(0, this.maxDisplaySize);
  }

  changeInterval(interval: number): void {
    this._listOptionsSubject.next({
      ...this._listOptionsSubject.value,
      interval,
    });
    this.generateNewData();
  }

  onArraySizeChange(dataSize: number): void {
    this._listOptionsSubject.next({
      ...this._listOptionsSubject.value,
      dataSize,
    });
    this.generateNewData();
  }

  changeSpecifiedIds(values: number[]): void {
    this._additionalIDsSubject.next(values);
  }

}
