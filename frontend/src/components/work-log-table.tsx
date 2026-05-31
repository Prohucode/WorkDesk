import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { WorkLog } from "@/types/work-log"

type Props = {
  logs: WorkLog[]
  sort: "asc" | "desc"
  onSortChange: () => void
  onEdit: (log: WorkLog) => void
  onDelete: (id: number) => void
}

export function WorkLogTable({
  logs,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                className="-ml-2"
                size="sm"
                type="button"
                variant="ghost"
                onClick={onSortChange}
              >
                Дата
                {sort === "asc" ? <ArrowUp /> : <ArrowDown />}
              </Button>
            </TableHead>
            <TableHead>Вид работ</TableHead>
            <TableHead>Объем</TableHead>
            <TableHead>Исполнитель</TableHead>
            <TableHead>Комментарий</TableHead>
            <TableHead className="w-24 text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">
                {new Intl.DateTimeFormat("ru-RU").format(new Date(log.date))}
              </TableCell>
              <TableCell>{log.workType?.name || "Без вида работ"}</TableCell>
              <TableCell>
                {Number(log.quantity).toLocaleString("ru-RU")} {log.unit}
              </TableCell>
              <TableCell>{log.performer}</TableCell>
              <TableCell className="max-w-72 overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
                {log.note || "-"}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    title="Редактировать"
                    onClick={() => onEdit(log)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    title="Удалить"
                    onClick={() => onDelete(log.id)}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {!logs.length && (
            <TableRow>
              <TableCell
                className="h-32 text-center text-muted-foreground"
                colSpan={6}
              >
                Записей за выбранный период нет
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
