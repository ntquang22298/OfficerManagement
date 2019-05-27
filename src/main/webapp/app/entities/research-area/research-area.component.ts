import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { TreeNode } from 'primeng/api';
import { IResearchArea } from 'app/shared/model/research-area.model';
import { AccountService } from 'app/core';
import { ResearchAreaService } from './research-area.service';

@Component({
  selector: 'jhi-research-area',
  templateUrl: './research-area.component.html',
  styleUrls: ['research-area.component.scss']
})
export class ResearchAreaComponent implements OnInit, OnDestroy {
  researchAreas: IResearchArea[];
  currentAccount: any;
  eventSubscriber: Subscription;
  selected: TreeNode;
  isSaving: any;
  disable: boolean = true;
  trees: TreeNode[] = [];
  cancel: boolean = false;
  view: boolean = true;
  constructor(
    protected researchAreaService: ResearchAreaService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
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
        collapsedIcon: 'pi pi-folder'
      };
      trees.push(tree);
    });
    trees.forEach(t => {
      trees.forEach(e => {
        if (e.parent != null && e.parent.id === t.data) {
          t.children.push(e);
        }
      });
    });
    trees.forEach(t => {
      if (t.parent === null) {
        this.trees.push(t);
      }
    });
  }
  addNode(tree: TreeNode) {
    this.cancel = true;
    tree.expanded = true;
    let node: TreeNode = {
      label: null,
      data: null,
      parent: tree,
      children: []
    };
    tree.children.push(node);
  }
  cancelNode(tree: TreeNode) {
    this.cancel = false;
    tree.parent.children.pop();
  }

  saveNode(tree: TreeNode) {
    this.isSaving = true;
    this.disable = true;
    let researchArea: IResearchArea = {
      id: null,
      name: '',
      parent: null
    };
    if (tree.parent != null) {
      console.log(tree.parent.data);
      this.researchAreaService
        .find(tree.parent.data)
        .pipe(
          filter((res: HttpResponse<IResearchArea>) => res.ok),
          map((res: HttpResponse<IResearchArea>) => res.body)
        )
        .subscribe(
          (res: IResearchArea) => {
            researchArea.parent = res;
            researchArea.id = tree.data != null ? tree.data : null;
            researchArea.name = tree.label;
            if (researchArea.id !== null) {
              this.subscribeToSaveResponse(this.researchAreaService.update(researchArea));
            } else {
              this.subscribeToSaveResponse(this.researchAreaService.create(researchArea));
            }
          },
          (res: HttpErrorResponse) => this.onError(res.message)
        );
    } else {
      researchArea.parent == null;
      researchArea.id = tree.data != null ? tree.data : null;
      researchArea.name = tree.label;
      if (researchArea.id !== null) {
        this.subscribeToSaveResponse(this.researchAreaService.update(researchArea));
      } else {
        this.subscribeToSaveResponse(this.researchAreaService.create(researchArea));
      }
    }
  }
  deleteNode(tree: TreeNode) {
    if (tree.children != null) {
      tree.children.forEach(c => {
        this.deleteNode(c);
      });
    }
    this.researchAreaService.delete(tree.data).subscribe(response => {
      this.eventManager.broadcast({
        name: 'researchAreaListModification',
        content: 'Deleted an researchArea'
      });
    });
  }
  expandAll() {
    this.trees.forEach(node => {
      this.expandRecursive(node, true);
    });
  }

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
  changeView() {
    this.view = true;
  }
  changeEdit() {
    this.view = false;
  }
  ngOnInit() {
    this.loadAll();
    this.isSaving = false;
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInResearchAreas();
  }
  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IResearchArea) {
    return item.id;
  }

  registerChangeInResearchAreas() {
    this.eventSubscriber = this.eventManager.subscribe('researchAreaListModification', response => this.loadAll());
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IResearchArea>>) {
    result.subscribe((res: HttpResponse<IResearchArea>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.loadAll();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
