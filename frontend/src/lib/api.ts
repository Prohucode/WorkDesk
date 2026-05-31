import type { WorkLog, WorkLogPayload, WorkType } from "@/types/work-log"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Ошибка запроса",
    }))
    throw new Error(error.message || "Ошибка запроса")
  }

  if (response.status === 204) return undefined as T

  return response.json()
}

export function getWorkTypes() {
  return request<WorkType[]>("/work-types")
}

export function createWorkType(name: string) {
  return request<WorkType>("/work-types", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}

export function getWorkLogs(params: {
  dateFrom?: string
  dateTo?: string
  sort?: "asc" | "desc"
}) {
  const query = new URLSearchParams()

  if (params.dateFrom) query.set("dateFrom", params.dateFrom)
  if (params.dateTo) query.set("dateTo", params.dateTo)
  query.set("sort", params.sort || "desc")

  return request<WorkLog[]>(`/work-logs?${query.toString()}`)
}

export function createWorkLog(payload: WorkLogPayload) {
  return request<WorkLog>("/work-logs", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function updateWorkLog(id: number, payload: WorkLogPayload) {
  return request<WorkLog>(`/work-logs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  })
}

export function deleteWorkLog(id: number) {
  return request<void>(`/work-logs/${id}`, {
    method: "DELETE",
  })
}
