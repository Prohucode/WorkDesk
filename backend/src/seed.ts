import { WorkType } from "./models/index.js"

const defaultWorkTypes = [
  "Кладка перегородок",
  "Монтаж опалубки",
  "Армирование",
  "Бетонирование",
  "Штукатурные работы",
  "Монтаж инженерных сетей",
]

export async function seedWorkTypes() {
  await Promise.all(
    defaultWorkTypes.map((name) =>
      WorkType.findOrCreate({
        where: { name },
        defaults: { name },
      }),
    ),
  )
}
