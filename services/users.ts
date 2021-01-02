import bcrypt from 'bcrypt'

import MongoLib from '../lib/mongo'

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
    this.collection = 'users'
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

  public createUser({ user }: { user: TUser }) {
    const { name, userName, email, password } = user

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log(err)
        return
      }

      const createdUserId = await this.mongoDB.create(this.collection, {
        name,
        userName,
        email,
        password: hash,
      })

      return createdUserId
    })
  }
}

export default UsersService
