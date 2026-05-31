import { useState } from "react"
import { RotateCcw, ShieldCheck } from "lucide-react"

import { WorkLogForm } from "@/components/work-log-form"
import { WorkLogTable } from "@/components/work-log-table"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWorkLogData } from "@/hooks/use-work-log-data"
import type { WorkLog, WorkLogPayload } from "@/types/work-log"

export function WorkLogsPage() {
  const journal = useWorkLogData()
  const [editingLog, setEditingLog] = useState<WorkLog | null>(null)

  async function handleCreate(payload: WorkLogPayload) {
    try {
      journal.setError("")
      await journal.createLog(payload)
    } catch (requestError) {
      journal.setError(
        requestError instanceof Error
          ? requestError.message
          : "Не удалось создать запись",
      )
    }
  }

  async function handleUpdate(payload: WorkLogPayload) {
    if (!editingLog) return

    try {
      journal.setError("")
      await journal.updateLog(editingLog.id, payload)
      setEditingLog(null)
    } catch (requestError) {
      journal.setError(
        requestError instanceof Error
          ? requestError.message
          : "Не удалось обновить запись",
      )
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Удалить запись журнала?")
    if (!confirmed) return

    try {
      journal.setError("")
      await journal.removeLog(id)
    } catch (requestError) {
      journal.setError(
        requestError instanceof Error
          ? requestError.message
          : "Не удалось удалить запись",
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-normal">
            Записи журнала
          </h1>
          <p className="text-muted-foreground">
            Фиксация даты, вида работ, объема и исполнителя на объекте.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="http://localhost:3000/admin" rel="noreferrer" target="_blank">
            <ShieldCheck />
            AdminJS
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Записей</CardDescription>
            <CardTitle className="text-2xl">{journal.logs.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Суммарный объем</CardDescription>
            <CardTitle className="text-2xl">
              {journal.metrics.totalQuantity.toLocaleString("ru-RU")}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Исполнителей</CardDescription>
            <CardTitle className="text-2xl">
              {journal.metrics.performersCount}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Новая запись</CardTitle>
            <CardDescription>Все поля, кроме комментария, обязательны.</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkLogForm
              submitLabel="Добавить запись"
              workTypes={journal.workTypes}
              onCreateWorkType={journal.createType}
              onSubmit={handleCreate}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Фильтр по дате</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">С</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={journal.dateFrom}
                    onChange={(event) =>
                      journal.setDateFrom(event.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">По</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={journal.dateTo}
                    onChange={(event) => journal.setDateTo(event.target.value)}
                  />
                </div>
                <Button type="button" onClick={() => void journal.loadData()}>
                  Применить
                </Button>
                <Button
                  size="icon"
                  type="button"
                  variant="secondary"
                  title="Сбросить фильтр"
                  onClick={journal.resetFilters}
                >
                  <RotateCcw />
                </Button>
              </div>
            </CardContent>
          </Card>

          {journal.error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {journal.error}
            </div>
          )}

          {journal.isLoading ? (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
              Загрузка журнала...
            </div>
          ) : (
            <WorkLogTable
              logs={journal.logs}
              sort={journal.sort}
              onDelete={handleDelete}
              onEdit={setEditingLog}
              onSortChange={journal.toggleSort}
            />
          )}
        </div>
      </div>

      <Dialog open={Boolean(editingLog)} onOpenChange={() => setEditingLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование записи</DialogTitle>
            <DialogDescription>
              Изменения сохранятся в базе данных после подтверждения.
            </DialogDescription>
          </DialogHeader>
          <WorkLogForm
            initialValue={editingLog}
            submitLabel="Сохранить изменения"
            workTypes={journal.workTypes}
            onCreateWorkType={journal.createType}
            onSubmit={handleUpdate}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
