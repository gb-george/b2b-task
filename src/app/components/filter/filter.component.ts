import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent {

  @Output() millisecondsChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() arraySizeChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() additionalNumberChange: EventEmitter<number[]> = new EventEmitter<number[]>();

  
  filterForm: FormGroup;
  milliseconds: number = 1000;
  arraySize: number = 1000;



  constructor(private formBuilder: FormBuilder) {
    this.filterForm = this.formBuilder.group({
      milliseconds: [this.milliseconds, [Validators.required, this.numberValidator]],
      arraySize: [this.arraySize, [Validators.required, this.numberValidator]],
      additionalIDs: [null, [Validators.required, this.additionalIdsValidator]]
    });




  }

  private numberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value && ( isNaN(value) || value < 0) ? { nan: true } : null;
  }

  private additionalIdsValidator(control: AbstractControl): ValidationErrors | null  {
      const value = control.value;

      if (!value) {
        return null;
      }

      if (!/^\d+(,\d+)*$/.test(value)) {
        return { invalid: true };
      }
  
      return null;
  }

  onMillisecondsChange(value: number) {   
    this.millisecondsChange.emit(value);
  }

  onArraySizeChange(value: number) {
    this.arraySizeChange.emit(value);
  }

  onAdditionalIDsChange(value: string) {
    this.additionalNumberChange.emit(this.additionalIDsToArray(value));
  }

  private additionalIDsToArray(value: string): number[] {
    return value && value.split(',').map(Number);
  }
}
