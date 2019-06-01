import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { IOfficer, OfficerType, OfficerDegree } from 'app/shared/model/officer.model';
import { IUnit, Unit, UnitType } from 'app/shared/model/unit.model';
import { AccountService } from 'app/core';
import { OfficerService } from './officer.service';
import { UnitService } from '../unit';
import { TreeNode } from 'primeng/api';
import { ResearchAreaService } from '../research-area';
import { IResearchArea } from 'app/shared/model/research-area.model';
@Component({
  selector: 'jhi-officer',
  templateUrl: './officer.component.html',
  styleUrls: ['officer.component.scss']
})
export class OfficerComponent implements OnInit, OnDestroy {
  officers: IOfficer[];
  units: IUnit[];
  unit: IUnit;
  currentAccount: any;
  eventSubscriber: Subscription;
  results: any[];
  officerTypes = Object.values(OfficerType);
  officerDegrees = Object.values(OfficerDegree);
  offcierType: OfficerType;
  officerDegree: OfficerDegree;
  officerSearch: IOfficer;
  searchType: OfficerType;
  searchDegree: OfficerDegree;
  searchUnit: any;
  allType: OfficerType;
  allDegree: OfficerDegree;
  all: UnitType;
  trees: TreeNode[] = [];
  researchAreas: IResearchArea[];
  selectedUnit: IUnit;
  selectedNode:TreeNode;

  constructor(
    protected officerService: OfficerService,
    protected unitService: UnitService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService,
    protected researchAreaService: ResearchAreaService
  ) {
    this.loadUnits();
  }
  /**
   * reload page
   */
  loadAll() {
    this.officerService
      .query()
      .pipe(
        filter((res: HttpResponse<IOfficer[]>) => res.ok),
        map((res: HttpResponse<IOfficer[]>) => res.body)
      )
      .subscribe(
        (res: IOfficer[]) => {
          this.officers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.researchAreaService
      .query()
      .pipe(
        filter((res: HttpResponse<IResearchArea[]>) => res.ok),
        map((res: HttpResponse<IResearchArea[]>) => res.body)
      )
      .subscribe(
        (res: IResearchArea[]) => {
          this.researchAreas = res;
          this.createTree();
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInOfficers();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IOfficer) {
    return item.id;
  }

  registerChangeInOfficers() {
    this.eventSubscriber = this.eventManager.subscribe('officerListModification', response => this.loadAll());
  }
  /**
   * search officer by unit, degree and type
   */
  searchOfficer() {
    let unitName: string;
    if (this.searchUnit == null) {
      unitName = '0';
    } else {
      unitName = this.searchUnit;
    }
    this.officerService
      .search(unitName, this.searchDegree, this.searchType)
      .pipe(
        filter((res: HttpResponse<IOfficer[]>) => res.ok),
        map((res: HttpResponse<IOfficer[]>) => res.body)
      )
      .subscribe(
        (res: IOfficer[]) => {
          this.officers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
  /**
   * load all unit
   */
  loadUnits() {
    this.unitService
      .query()
      .pipe(
        filter((res: HttpResponse<IUnit[]>) => res.ok),
        map((res: HttpResponse<IUnit[]>) => res.body)
      )
      .subscribe(
        (res: IUnit[]) => {
          this.units = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
  /**
   * find officer by name
   */
  findByName() {
    this.officerService
      .findByName(this.officerSearch.fullName)
      .pipe(
        filter((res: HttpResponse<IOfficer[]>) => res.ok),
        map((res: HttpResponse<IOfficer[]>) => res.body)
      )
      .subscribe(
        (res: IOfficer[]) => {
          this.officers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
  /**
   * auto complete search officer by names
   * @param event 
   */
  search(event) {
    let query = event.query;
    this.officerService
      .query()
      .pipe(
        filter((res: HttpResponse<IOfficer[]>) => res.ok),
        map((res: HttpResponse<IOfficer[]>) => res.body)
      )
      .subscribe(
        (res: IOfficer[]) => {
          this.officers = res;
          this.results = this.filterOfficer(query, this.officers);
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
  filterOfficer(query, officers: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < officers.length; i++) {
      let officer = officers[i];
      if (officer.fullName.toLowerCase().includes(query.toLowerCase()) === true) {
        filtered.push(officer);
      }
    }
    return filtered;
  }
  /**
   * check if current account is admin or not
   */
  isAdmin() {
    return this.accountService.hasAnyAuthority(['ROLE_ADMIN', 'ROLE_USER']);
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
  /**
   * create tree of research area
   */
  createTree() {
    this.trees = [];
    const trees: TreeNode[] = [];
    this.researchAreas.forEach(r => {
      const tree: TreeNode = {
        label: r.name,
        data: r.id,
        children: [],
        parent: r.parent ? r.parent : null,
        expandedIcon: 'pi pi-folder-open',
        collapsedIcon: 'pi pi-folder',
        expanded: true
      };
      trees.push(tree);
    });
    this.researchAreas.forEach(r => {
      trees.forEach(t => {
        trees.forEach(e => {
          if (r.id == t.data && r.parent != null && r.parent.id == e.data) {
            e.children.push(t);
          }
        });
      });
    });
    trees.forEach(t => {
      if (t.parent === null) {
        this.trees.push(t);
      }
    });
  }
  /**
   * expand all tree
   */
  expandAll() {
    this.trees.forEach(node => {
      this.expandRecursive(node, true);
    });
  }
  /**
   * collapse all tree
   */
  collapseAll() {
    this.trees.forEach(node => {
      this.expandRecursive(node, false);
    });
  }
  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
  /**
   * filter officer by unit
   */
  filterByUnit() {
    this.officerService
      .search(this.selectedUnit.name, null, null)
      .pipe(
        filter((res: HttpResponse<IOfficer[]>) => res.ok),
        map((res: HttpResponse<IOfficer[]>) => res.body)
      )
      .subscribe(
        (res: IOfficer[]) => {
          this.officers = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }
  /**
   * filter officer by research area
   * @param event click on tree
   */
  findByResearch(event){
    this.officerService
    .findByResearch(event.node.data)
    .pipe(
      filter((res: HttpResponse<IOfficer[]>) => res.ok),
      map((res: HttpResponse<IOfficer[]>) => res.body)
    )
    .subscribe(
      (res: IOfficer[]) => {
        this.officers = res;
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }
}
