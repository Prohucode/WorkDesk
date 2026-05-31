export type WorkType = {
  id: number
  name: string
}

export type WorkLog = {
  id: number
  date: string
  workTypeId: number
  quantity: number | string
  unit: string
  performer: string
  note?: string | null
  workType?: WorkType
}

export type WorkLogPayload = {
  date: string
  workTypeId: number
  quantity: number
  unit: string
  performer: string
  note?: string | null
}
