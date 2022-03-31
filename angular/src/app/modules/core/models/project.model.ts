export interface IProject {
  id: string
  name: string
  managerId: string
  description: string
  photo: string
  tasksId: string[]
  team: string[]
  deleted: boolean,
}