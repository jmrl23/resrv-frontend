import { Term } from './term'

export type Course = {
  id: string
  dateCreated: Date
  lastUpdated: Date
  enabled: boolean
  name: string
  alias: string
  lecUnit: number
  programId: string
  term: Term
}
