import { Component, OnInit } from '@angular/core';
import { ProjectStore } from '../project.store';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  constructor(public projectStore: ProjectStore) { }

  ngOnInit(): void {
  }

}
