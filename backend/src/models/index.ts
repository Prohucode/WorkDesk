import { WorkLog } from "./work-log.model.js"
import { WorkType } from "./work-type.model.js"

WorkType.hasMany(WorkLog, {
  foreignKey: "workTypeId",
  as: "logs",
})

WorkLog.belongsTo(WorkType, {
  foreignKey: "workTypeId",
  as: "workType",
})

export { WorkLog, WorkType }
