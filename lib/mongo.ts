import { MongoClient, ObjectId } from "mongodb"
import { envConfig } from "../config"

const USER = encodeURIComponent(envConfig.dbUser as string)
const PASSWORD = encodeURIComponent(envConfig.dbPassword as string)
const DB_NAME = envConfig.dbName
const DB_HOST = envConfig.dbHost

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`

class MongoLib {
  public client: MongoClient
  private dbName: string
  static connection: any

  constructor() {
    this.client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    this.dbName = DB_NAME as string
  }

  private connect() {
    if (!MongoLib.connection) {
      MongoLib.connection = new Promise((resolve, reject) => {
        this.client.connect((err) => {
          if (err) {
            reject(err)
          }

          console.log("Connected succesfully to mongo")
          resolve(this.client.db(this.dbName))
        })
      })
    }

    return MongoLib.connection
  }

  public getAll(collection: string, query?: any) {
    return this.connect().then((db: any) => {
      return db.collection(collection).find(query).toArray()
    })
  }

  public get(collection: string, id: string) {
    return this.connect().then((db: any) => {
      return db.collection(collection).findOne({ _id: new ObjectId(id) })
    })
  }

  create(collection: string, data: any) {
    return this.connect()
      .then((db: any) => {
        return db.collection(collection).insertOne(data)
      })
      .then((result: any) => result.insertedId)
  }

  update(collection: string, id: string, data: any) {
    return this.connect()
      .then((db: any) => {
        return db
          .collection(collection)
          .updateOne(
            { _id: new ObjectId(id) },
            { $set: data },
            { upsert: true }
          )
      })
      .then((result: any) => result.upsertedId || id)
  }

  delete(collection: string, id: string) {
    return this.connect()
      .then((db: any) => {
        return db.collection(collection).deleteOne({ _id: new ObjectId(id) })
      })
      .then(() => id)
  }
}

export default MongoLib
