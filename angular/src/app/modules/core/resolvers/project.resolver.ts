import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {ProjectService} from "../services/project.service";
import {ProjectStore} from "../../projects/project.store";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ProjectResolver implements Resolve<void> {
  constructor(private projectService: ProjectService, private projectStore: ProjectStore) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<void> {
    const project = await this.projectService.getOne(route.paramMap.get('id') ?? '').toPromise()
    this.projectStore.setProject(project!);

  }

}
