import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataDisplayComponent } from './data-display.component';
import { DataElement, ChildElement } from '../../models/data.model';

describe('DataDisplayComponent', () => {
  let component: DataDisplayComponent;
  let fixture: ComponentFixture<DataDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDisplayComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have trackByItemId method', () => {
    const dataElement: DataElement = {
      id: '1',
      int: 42,
      float: 3.14,
      color: '#ff0000',
      child: { id: 1, color: '#00ff00' } as ChildElement,
    };

    const trackResult = component.trackByItemId(0, dataElement);

    expect(trackResult).toBe('1');
  });
});
