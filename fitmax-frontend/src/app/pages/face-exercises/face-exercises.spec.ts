import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceExercises } from './face-exercises';

describe('FaceExercises', () => {
  let component: FaceExercises;
  let fixture: ComponentFixture<FaceExercises>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaceExercises],
    }).compileComponents();

    fixture = TestBed.createComponent(FaceExercises);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
