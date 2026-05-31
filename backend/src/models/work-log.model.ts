import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../db.js"

export class WorkLog extends Model<
  InferAttributes<WorkLog>,
  InferCreationAttributes<WorkLog>
> {
  declare id: CreationOptional<number>
  declare date: string
  declare workTypeId: number
  declare quantity: number
  declare unit: string
  declare performer: string
  declare note: CreationOptional<string | null>
}

WorkLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    workTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    performer: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "work_logs",
  },
)
