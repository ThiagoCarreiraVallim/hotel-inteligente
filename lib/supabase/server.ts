import { mockData } from "./mocks"

class MockQuery {
  table: string
  _single = false
  _eq: { column?: string; value?: any } | null = null

  constructor(table: string) {
    this.table = table
  }

  select(_cols?: string) {
    return this
  }

  order(_col: string, _opts?: any) {
    return this
  }

  eq(column: string, value: any) {
    this._eq = { column, value }
    return this
  }

  single() {
    this._single = true
    return this
  }

  insert(payload: any) {
    // simple insert into mockData
    if (!mockData[this.table]) mockData[this.table] = []
    const item = { id: payload.id || `${this.table}_${Date.now()}`, ...payload }
    mockData[this.table].push(item)
    return Promise.resolve({ data: [item], error: null })
  }

  then(resolve: any) {
    let data = mockData[this.table] || []
    if (this._eq && this._eq.column) {
      data = data.filter((d) => String(d[this._eq!.column]) === String(this._eq!.value))
    }
    if (this._single) {
      return Promise.resolve(resolve({ data: data[0] ?? null }))
    }
    return Promise.resolve(resolve({ data }))
  }
}

const client = {
  from: (table: string) => new MockQuery(table),
  auth: {
    getUser: async () => {
      // return the first mock profile as the authenticated user
      const user = mockData.profiles?.[0] ?? null
      return { data: { user } }
    },
  },
}

export async function createClient() {
  return client
}

export default createClient
