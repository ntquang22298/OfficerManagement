import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IOfficer, Officer } from 'app/shared/model/officer.model';
import { IUser, UserService } from 'app/core';
import { IResearchArea } from 'app/shared/model/research-area.model';
import { ResearchAreaService } from 'app/entities/research-area';
import { IConcernArea } from 'app/shared/model/concern-area.model';
import { ConcernAreaService } from 'app/entities/concern-area';
import { IUnit } from 'app/shared/model/unit.model';
import { UnitService } from 'app/entities/unit';
import { AccountService, JhiLanguageHelper } from 'app/core';
import { OfficerService } from 'app/entities/officer';
import { ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { TreeNode } from 'primeng/api';
@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('alert') alert: ElementRef;
  error: string;
  success: string;
  languages: any[];
  officer: IOfficer;
  isSaving: boolean;
  users: IUser[];
  researchAreas: IResearchArea[];
  concernAreas: IConcernArea[];
  trees: TreeNode[] = [];
  selectedFiles: TreeNode[] = [];

  units: IUnit[];
  settingsForm = this.fb.group({
    firstName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    lastName: [undefined, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    email: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    VNUemail: [undefined, [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email]],
    activated: [false],
    authorities: [[]],
    langKey: ['en'],
    login: [],
    imageUrl: [],
    unit: [],
    type: [],
    degree: []
  });
  file: File = null;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    protected jhiAlertService: JhiAlertService,
    protected officerService: OfficerService,
    protected userService: UserService,
    protected researchAreaService: ResearchAreaService,
    protected concernAreaService: ConcernAreaService,
    protected unitService: UnitService,
    protected activatedRoute: ActivatedRoute,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.loadAll();

    this.unitService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IUnit[]>) => mayBeOk.ok),
        map((response: HttpResponse<IUnit[]>) => response.body)
      )
      .subscribe((res: IUnit[]) => (this.units = res), (res: HttpErrorResponse) => this.onError(res.message));
  }
  loadAll() {
    this.loadReasearchArea();
  }
  loadReasearchArea() {
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
  /**
   * Save user information
   */
  save() {
    if (this.downloadURL != null) {
      this.downloadURL.subscribe(res => {
        const settingsAccount = this.accountFromForm();
        const officer = this.createFromForm();
        officer.avatarUrl = res.toString();
        this.accountService.save(settingsAccount).subscribe(
          () => {
            this.error = null;
            this.success = 'OK';
          },
          () => {
            this.success = null;
            this.error = 'ERROR';
          }
        );
        if (officer.id !== undefined) {
          this.subscribeToSaveResponse(this.officerService.update(officer));
        } else {
          this.subscribeToSaveResponse(this.officerService.create(officer));
        }
      });
    } else {
      const settingsAccount = this.accountFromForm();
      const officer = this.createFromForm();
      this.accountService.save(settingsAccount).subscribe(
        () => {
          this.error = null;
          this.success = 'OK';
        },
        () => {
          this.success = null;
          this.error = 'ERROR';
        }
      );
      if (officer.id !== undefined) {
        console.log(officer);
        this.subscribeToSaveResponse(this.officerService.update(officer));
      } else {
        this.subscribeToSaveResponse(this.officerService.create(officer));
      }
    }
  }
  private createFromForm(): IOfficer {
    this.selectesFilesToResearchAreas();
    const entity = {
      ...new Officer(),
      id: this.officer.id,
      code: this.officer.code,
      fullName: this.settingsForm.get('firstName').value,
      avatarUrl: this.settingsForm.get(['imageUrl']).value,
      vNUEmail: this.settingsForm.get(['VNUemail']).value,
      degree: this.settingsForm.get(['degree']).value,
      type: this.settingsForm.get(['type']).value,
      user: this.officer.user,
      unit: this.settingsForm.get(['unit']).value,
      researchAreas: this.officer.researchAreas
    };
    return entity;
  }
  private accountFromForm(): any {
    const account = {};
    return {
      ...account,
      firstName: this.settingsForm.get('firstName').value,
      lastName: this.settingsForm.get('lastName').value,
      email: this.settingsForm.get('email').value,
      activated: this.settingsForm.get('activated').value,
      authorities: this.settingsForm.get('authorities').value,
      langKey: this.settingsForm.get('langKey').value,
      login: this.settingsForm.get('login').value,
      imageUrl: this.settingsForm.get('imageUrl').value
    };
  }
  /**
   * update information form after load
   */
  updateForm(): void {
    const account = this.officer.user;
    this.settingsForm.patchValue({
      firstName: this.officer.fullName,
      lastName: account.lastName,
      email: account.email,
      activated: account.activated,
      authorities: account.authorities,
      langKey: account.langKey,
      login: account.login,
      imageUrl: this.officer.avatarUrl,
      unit: this.officer.unit,
      type: this.officer.type,
      degree: this.officer.degree,
      VNUemail: this.officer.vNUEmail
    });
  }
  /**
   * create trê from research area
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
    this.officerService
      .findByUser()
      .pipe(
        filter((res: HttpResponse<IOfficer>) => res.ok),
        map((res: HttpResponse<IOfficer>) => res.body)
      )
      .subscribe(
        (res: IOfficer) => {
          this.officer = res;
          console.log(res);
          res.researchAreas.forEach(element => {
            trees.forEach(t => {
              if (element.id === t.data) {
                console.log(element.id);
                this.selectedFiles.push(t);
              }
            });
          });
          this.updateForm();
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
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
  selectesFilesToResearchAreas() {
    this.officer.researchAreas = [];
    this.selectedFiles.forEach(tree => {
      if (tree.parent != null) {
        this.researchAreas.forEach(element => {
          if (element.id === tree.parent.data) {
            const researchArea: IResearchArea = {
              id: tree.data,
              name: tree.label,
              parent: element,
              childs: null
            };
            this.officer.researchAreas.push(researchArea);
          }
        });
      } else {
        const researchArea: IResearchArea = {
          id: tree.data,
          name: tree.label,
          parent: null,
          childs: null
        };
        this.officer.researchAreas.push(researchArea);
      }
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

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOfficer>>) {
    result.subscribe((res: HttpResponse<IOfficer>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }
  protected onSaveSuccess() {
    this.isSaving = false;
    this.selectedFiles = [];
    this.loadAll();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'image/';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task
      .snapshotChanges()
      .pipe(finalize(() => (this.downloadURL = fileRef.getDownloadURL())))
      .subscribe();
  }
}
