import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectStore } from './project.store';

export interface IProject {
  id: number,
  name: string,
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name'];
  public dataSource: MatTableDataSource<IProject> = new MatTableDataSource();

  constructor(public projectStore: ProjectStore, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.dataSource.data = [{id: 1, name: 'My project'}]
  }

  public selectProject(project: IProject) {
    this.projectStore.setProject(project);
    this.router.navigate([`${project.id}`], {relativeTo: this.route});
  }

}
