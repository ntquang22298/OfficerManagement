import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOfficer } from 'app/shared/model/officer.model';
import { Router } from "@angular/router"
@Component({
  selector: 'jhi-officer-detail',
  styleUrls: ['officer-detail.scss'],
  templateUrl: './officer-detail.component.html'
})
export class OfficerDetailComponent implements OnInit {
  officer: IOfficer;

  constructor(protected activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ officer }) => {
      this.officer = officer;
    });
  }

  previousState() {
    window.history.back();
  }
  getConcernArea(id) {
    this.router.navigate(['/concern-area/' + id + '/view'])
  }
}
