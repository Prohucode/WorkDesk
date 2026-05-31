import { type FormEvent, useMemo, useState } from "react"
import { Save } from "lucide-react"

import { WorkTypeSelect } from "@/components/work-type-select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { WorkLog, WorkLogPayload, WorkType } from "@/types/work-log"

const today = new Date().toISOString().slice(0, 10)

type Props = {
  workTypes: WorkType[]
  initialValue?: WorkLog | null
  submitLabel: string
  onSubmit: (payload: WorkLogPayload) => Promise<void>
  onCreateWorkType: (name: string) => Promise<WorkType>
}

export function WorkLogForm({
  workTypes,
  initialValue,
  submitLabel,
  onSubmit,
  onCreateWorkType,
}: Props) {
  const defaultWorkTypeId = workTypes[0] ? String(workTypes[0].id) : ""
  const initialForm = useMemo(
    () =>
      initialValue
        ? {
            date: initialValue.date,
            workTypeId: String(initialValue.workTypeId),
            quantity: String(initialValue.quantity),
            unit: initialValue.unit,
            performer: initialValue.performer,
            note: initialValue.note || "",
          }
        : {
            date: today,
            workTypeId: defaultWorkTypeId,
            quantity: "",
            unit: "м3",
            performer: "",
            note: "",
          },
    [defaultWorkTypeId, initialValue],
  )
  const [form, setForm] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        date: form.date,
        workTypeId: Number(form.workTypeId || defaultWorkTypeId),
        quantity: Number(form.quantity),
        unit: form.unit.trim(),
        performer: form.performer.trim(),
        note: form.note.trim() || null,
      })

      if (!initialValue) {
        setForm({
          date: today,
          workTypeId: defaultWorkTypeId,
          quantity: "",
          unit: "м3",
          performer: "",
          note: "",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date">Дата выполнения</Label>
          <Input
            id="date"
            required
            type="date"
            value={form.date}
            onChange={(event) => setForm({ ...form, date: event.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Вид работ</Label>
          <WorkTypeSelect
            value={form.workTypeId || defaultWorkTypeId}
            workTypes={workTypes}
            onCreateWorkType={onCreateWorkType}
            onValueChange={(workTypeId) => setForm({ ...form, workTypeId })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <div className="space-y-2">
          <Label htmlFor="quantity">Объем</Label>
          <Input
            id="quantity"
            required
            min="0.001"
            step="0.001"
            type="number"
            value={form.quantity}
            onChange={(event) =>
              setForm({ ...form, quantity: event.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Ед. изм.</Label>
          <Input
            id="unit"
            required
            value={form.unit}
            onChange={(event) => setForm({ ...form, unit: event.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="performer">Исполнитель</Label>
        <Input
          id="performer"
          required
          minLength={2}
          placeholder="Бригада или работник"
          value={form.performer}
          onChange={(event) =>
            setForm({ ...form, performer: event.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Комментарий</Label>
        <Textarea
          id="note"
          value={form.note}
          onChange={(event) => setForm({ ...form, note: event.target.value })}
        />
      </div>

      <Button type="submit" disabled={isSubmitting || !workTypes.length}>
        <Save />
        {isSubmitting ? "Сохранение..." : submitLabel}
      </Button>
    </form>
  )
}
