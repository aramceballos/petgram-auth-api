import MongoLib from '../lib/mongo'

class ApiKeysService {
  private collection: string
  private mongoDB: MongoLib

  constructor() {
    this.collection = 'api-keys'
    this.mongoDB = new MongoLib()
  }

  async getApiKey({ token }: { token: string }) {
    const apiKey = await this.mongoDB.getAll(this.collection, { token })
    return apiKey
  }
}

export default ApiKeysService
