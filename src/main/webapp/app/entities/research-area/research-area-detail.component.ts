import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IResearchArea } from 'app/shared/model/research-area.model';

@Component({
  selector: 'jhi-research-area-detail',
  templateUrl: './research-area-detail.component.html'
})
export class ResearchAreaDetailComponent implements OnInit {
  researchArea: IResearchArea;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ researchArea }) => {
      this.researchArea = researchArea;
    });
  }

  previousState() {
    window.history.back();
  }
}
