import { useState } from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { WorkType } from "@/types/work-log"

type Props = {
  value: string
  workTypes: WorkType[]
  disabled?: boolean
  onValueChange: (value: string) => void
  onCreateWorkType: (name: string) => Promise<WorkType>
}

const normalize = (value: string) => value.trim().toLowerCase()

export function WorkTypeSelect({
  value,
  workTypes,
  disabled,
  onValueChange,
  onCreateWorkType,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const selectedWorkType = workTypes.find(
    (workType) => String(workType.id) === value,
  )
  const trimmedName = newName.trim()
  const alreadyExists = workTypes.some(
    (workType) => normalize(workType.name) === normalize(trimmedName),
  )
  const canCreate = trimmedName.length >= 2 && !alreadyExists

  async function handleCreate() {
    if (!canCreate) return

    setIsCreating(true)

    try {
      const workType = await onCreateWorkType(trimmedName)
      onValueChange(String(workType.id))
      setNewName("")
      setIsOpen(false)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="truncate">
            {selectedWorkType?.name || "Выберите вид работ"}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div className="max-h-56 overflow-y-auto p-1">
          {workTypes.map((workType) => (
            <button
              key={workType.id}
              type="button"
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-muted",
                String(workType.id) === value && "bg-muted",
              )}
              onClick={() => {
                onValueChange(String(workType.id))
                setIsOpen(false)
              }}
            >
              <span className="truncate">{workType.name}</span>
              {String(workType.id) === value && <Check className="size-4" />}
            </button>
          ))}
        </div>
        <div className="border-t p-2">
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Input
              value={newName}
              placeholder="Новый вид работ"
              onChange={(event) => setNewName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  void handleCreate()
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              disabled={!canCreate || isCreating}
              onClick={handleCreate}
            >
              <Plus />
              {isCreating ? "..." : "Добавить"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
