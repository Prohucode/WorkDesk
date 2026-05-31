import { useCallback, useEffect, useMemo, useState } from "react"

import {
  createWorkLog,
  createWorkType,
  deleteWorkLog,
  getWorkLogs,
  getWorkTypes,
  updateWorkLog,
} from "@/lib/api"
import type { WorkLog, WorkLogPayload, WorkType } from "@/types/work-log"

export function useWorkLogData() {
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [workTypes, setWorkTypes] = useState<WorkType[]>([])
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sort, setSort] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = useCallback(
    async (overrides?: {
      dateFrom?: string
      dateTo?: string
      sort?: "asc" | "desc"
    }) => {
      setIsLoading(true)
      setError("")

      try {
        const [typesResult, logsResult] = await Promise.all([
          getWorkTypes(),
          getWorkLogs({
            dateFrom: overrides?.dateFrom ?? dateFrom,
            dateTo: overrides?.dateTo ?? dateTo,
            sort: overrides?.sort ?? sort,
          }),
        ])

        setWorkTypes(typesResult)
        setLogs(logsResult)
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Не удалось загрузить данные",
        )
      } finally {
        setIsLoading(false)
      }
    },
    [dateFrom, dateTo, sort],
  )

  useEffect(() => {
    queueMicrotask(() => void loadData())
  }, [loadData])

  const metrics = useMemo(() => {
    const totalQuantity = logs.reduce(
      (sum, log) => sum + Number(log.quantity),
      0,
    )
    const performers = new Set(logs.map((log) => log.performer))
    const latestDate = logs[0]?.date || null

    return {
      totalQuantity,
      performersCount: performers.size,
      latestDate,
    }
  }, [logs])

  async function createLog(payload: WorkLogPayload) {
    await createWorkLog(payload)
    await loadData()
  }

  async function createType(name: string) {
    const workType = await createWorkType(name)
    const typesResult = await getWorkTypes()
    setWorkTypes(typesResult)
    return workType
  }

  async function updateLog(id: number, payload: WorkLogPayload) {
    await updateWorkLog(id, payload)
    await loadData()
  }

  async function removeLog(id: number) {
    await deleteWorkLog(id)
    await loadData()
  }

  function resetFilters() {
    setDateFrom("")
    setDateTo("")
    void loadData({ dateFrom: "", dateTo: "" })
  }

  function toggleSort() {
    const nextSort = sort === "asc" ? "desc" : "asc"
    setSort(nextSort)
  }

  return {
    logs,
    workTypes,
    dateFrom,
    dateTo,
    sort,
    isLoading,
    error,
    metrics,
    setDateFrom,
    setDateTo,
    setError,
    loadData,
    createLog,
    createType,
    updateLog,
    removeLog,
    resetFilters,
    toggleSort,
  }
}
