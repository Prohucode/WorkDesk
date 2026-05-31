import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { LucideIcon } from "lucide-react"
import { CalendarDays, ClipboardList, Hammer, RotateCcw, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getWorkLogs, getWorkTypes } from "@/lib/api"
import type { WorkLog, WorkType } from "@/types/work-log"

export function DashboardPage() {
  const [logs, setLogs] = useState<WorkLog[]>([])
  const [workTypes, setWorkTypes] = useState<WorkType[]>([])
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = useCallback(async (params: { dateFrom?: string; dateTo?: string } = {}) => {
    setIsLoading(true)
    setError("")

    try {
      const [logsResult, typesResult] = await Promise.all([
        getWorkLogs({
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
          sort: "asc",
        }),
        getWorkTypes(),
      ])

      setLogs(logsResult)
      setWorkTypes(typesResult)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Не удалось загрузить данные",
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => void loadData())
  }, [loadData])

  const totalQuantity = useMemo(
    () => logs.reduce((sum, log) => sum + Number(log.quantity), 0),
    [logs],
  )

  const performersCount = useMemo(
    () => new Set(logs.map((log) => log.performer)).size,
    [logs],
  )

  const chartData = useMemo(() => {
    const volumesByDate = logs.reduce<Record<string, number>>((result, log) => {
      result[log.date] = (result[log.date] || 0) + Number(log.quantity)
      return result
    }, {})

    return Object.entries(volumesByDate).map(([date, quantity]) => ({
      date,
      label: new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
      }).format(new Date(date)),
      quantity,
    }))
  }, [logs])

  function resetFilters() {
    setDateFrom("")
    setDateTo("")
    void loadData({ dateFrom: "", dateTo: "" })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-normal">
          Журнал работ на объекте
        </h1>
        <p className="text-muted-foreground">
          Сводка для прораба по выполненным работам, исполнителям и объемам.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Записи" value={String(logs.length)} icon={ClipboardList} />
        <Metric
          title="Суммарный объем"
          value={totalQuantity.toLocaleString("ru-RU")}
          icon={Hammer}
        />
        <Metric title="Исполнители" value={String(performersCount)} icon={Users} />
        <Metric title="Виды работ" value={String(workTypes.length)} icon={CalendarDays} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Объем работ по дням</CardTitle>
          <CardDescription>
            Сумма выполненного объема за каждый день выбранного периода.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="dashboardDateFrom">С</Label>
              <Input
                id="dashboardDateFrom"
                type="date"
                value={dateFrom}
                onChange={(event) => setDateFrom(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dashboardDateTo">По</Label>
              <Input
                id="dashboardDateTo"
                type="date"
                value={dateTo}
                onChange={(event) => setDateTo(event.target.value)}
              />
            </div>
            <Button
              type="button"
              onClick={() => void loadData({ dateFrom, dateTo })}
            >
              Применить
            </Button>
            <Button
              size="icon"
              type="button"
              variant="secondary"
              title="Сбросить фильтр"
              onClick={resetFilters}
            >
              <RotateCcw />
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="h-80 rounded-lg border p-4">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Загрузка графика...
              </div>
            ) : chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    width={44}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", fillOpacity: 0.45 }}
                    formatter={(value) => [
                      Number(value).toLocaleString("ru-RU"),
                      "Объем",
                    ]}
                    labelFormatter={(_, payload) => {
                      const item = payload?.[0]?.payload as
                        | { date?: string }
                        | undefined

                      return item?.date
                        ? new Intl.DateTimeFormat("ru-RU").format(
                            new Date(item.date),
                          )
                        : ""
                    }}
                  />
                  <Bar dataKey="quantity" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Нет данных за выбранный период
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon: LucideIcon
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{title}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
    </div>
  )
}
