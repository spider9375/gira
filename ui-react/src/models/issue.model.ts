export interface IIssue {
  id: string
  title: string
  status: string
  addedBy: string
  sprint: string
  assignedTo: string
  project: string
  storyPoints: number
  description: string
  deleted: boolean
}
