import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { spyOn } from 'jest-mock';


describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();

    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit millisecondsChange event', () => {
    const spy = spyOn(component.millisecondsChange, 'emit');
    const value = 2000;

    component.onMillisecondsChange(value);

    expect(spy).toHaveBeenCalledWith(value);
  });

  it('should emit arraySizeChange event', () => {
    const spy = spyOn(component.arraySizeChange, 'emit');
    const value = 500;

    component.onArraySizeChange(value);

    expect(spy).toHaveBeenCalledWith(value);
  });

  it('should emit additionalNumberChange event', () => {
    const spy = spyOn(component.additionalNumberChange, 'emit');
    const value = '1,2,3';
    const expectedArray = [1, 2, 3];

    component.onAdditionalIDsChange(value);

    expect(spy).toHaveBeenCalledWith(expectedArray);
  });

  it('should mark arraySize control as invalid when input is not a number', () => {
    component.filterForm.get('arraySize')?.setValue('abc');
    expect(component.filterForm.get('arraySize')?.hasError('nan')).toBeTruthy();
  });

  it('should mark additionalIDs control as invalid when input is not in the correct format', () => {
    component.filterForm.get('additionalIDs')?.setValue('1,2,abc');
    expect(component.filterForm.get('additionalIDs')?.hasError('invalid')).toBeTruthy();
  });


  afterEach(() => {
    fixture.destroy();
  });
});
