import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../../database/db';
// Interface for Book attributes
interface BookAttributes {
  id: number;
  title: string;
  author: string;
  publishedYear: number;
  genres: string[]; // Note: You'll need to handle arrays specially in SQL
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Book creation attributes
interface BookCreationAttributes
  extends Optional<BookAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Book model
class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
  public id!: number;
  public title!: string;
  public author!: string;
  public publishedYear!: number;
  public genres!: string[];
  public stock!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publishedYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genres: {
      type: DataTypes.JSON, // Store as JSON in SQL database
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'books',
    timestamps: true,
  }
);

export default Book;
