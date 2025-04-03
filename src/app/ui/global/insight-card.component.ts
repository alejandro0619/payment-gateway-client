import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'insight-card',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './insight-card.component.html',
})
export class InsightCard implements OnInit {
  data: any;
  options: any;
  plaformId = inject(PLATFORM_ID);


  constructor(
  ) { }

  ngOnInit(): void {
    
  }

}