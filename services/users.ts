import bcrypt from "bcrypt"

import MongoLib from "../lib/mongo"

type TUser = {
  id: string
  name: string
  userName: string
  password: string
  email: string
  isAdmin: boolean
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

  public async getUser({ email }: { email: string }) {
    const [user] = await this.mongoDB.getAll(this.collection, { email })

    return user
  }

  public async createUser({ user }: { user: TUser }) {
    const { name, userName, email, password } = user

    let hashedPassword = ""

    bcrypt.hash(password, 10, (err, hash) => {
      hashedPassword = hash
    })

    const createdUserId = await this.mongoDB.create(this.collection, {
      name,
      userName,
      email,
      password: hashedPassword,
    })

    return createdUserId
  }
}

export default UsersService
