import MongoLib from "../lib/mongo"

type TUser = {
  id: string
  name: string
  user: string
  password: string
  email: string
}

class UsersService {
  private collection: string
  private mongoDB: MongoLib

  constructor() {
    this.collection = "users"
    this.mongoDB = new MongoLib()
  }

  public async getUsers(): Promise<TUser[]> {
    const users = await this.mongoDB.getAll(this.collection)

    return users
  }

  public async getUser({ userId }: { userId: string }): Promise<TUser> {
    const user = await this.mongoDB.get(this.collection, userId)

    return user
  }
}

export default UsersService
