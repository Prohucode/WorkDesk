import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize"
import { sequelize } from "../db.js"

export class WorkType extends Model<
  InferAttributes<WorkType>,
  InferCreationAttributes<WorkType>
> {
  declare id: CreationOptional<number>
  declare name: string
}

WorkType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "work_types",
  },
)
