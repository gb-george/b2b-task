import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { of } from 'rxjs';
import { FilterComponent } from './components/filter/filter.component';
import { DataDisplayComponent } from './components/data-display/data-display.component';
import { ReactiveFormsModule } from '@angular/forms';

jest.mock('./services/data.service', () => {
  return {
    DataService: jest.fn().mockImplementation(() => {
      return {
        createWorker: jest.fn(),
        generateNewData: jest.fn(),
        changeInterval: jest.fn(),
        onArraySizeChange: jest.fn(),
        changeSpecifiedIds: jest.fn(),
        shortLisAdditionalIds$: of([])
      };
    }),
  };
});

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let dataServiceMock: jest.Mocked<DataService>;
  let cdrMock: jest.Mocked<ChangeDetectorRef>;

  beforeEach(() => {
    dataServiceMock = {
      createWorker: jest.fn(),
      generateNewData: jest.fn(),
      changeInterval: jest.fn(),
      onArraySizeChange: jest.fn(),
      changeSpecifiedIds: jest.fn(),
      shortLisAdditionalIds$: of([]),
    } as any;

    cdrMock = {
      detectChanges: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      declarations: [AppComponent, FilterComponent, DataDisplayComponent],
      providers: [
        { provide: DataService, useValue: dataServiceMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
      imports: [
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should call generateNewData on ngOnInit', () => {
    component.ngOnInit();
    expect(dataServiceMock.generateNewData).toHaveBeenCalled();
  });

  it('should call changeInterval on onMillisecondsChange', () => {
    const milliseconds = 1000;
    component.onMillisecondsChange(milliseconds);
    expect(dataServiceMock.changeInterval).toHaveBeenCalledWith(milliseconds);
  });

  it('should call onArraySizeChange on onArraySizeChange', () => {
    const arraySize = 100;
    component.onArraySizeChange(arraySize);
    expect(dataServiceMock.onArraySizeChange).toHaveBeenCalledWith(arraySize);
  });

  it('should call changeSpecifiedIds on onAdditionalNumberChange', async () => {
    const specifiedIds = [1, 2, 3];
    component.onAdditionalNumberChange(specifiedIds);

    await fixture.whenStable();

    expect(dataServiceMock.changeSpecifiedIds).toHaveBeenCalledWith(specifiedIds);
  });
});
