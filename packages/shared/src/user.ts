export interface User {
  id: string,
  totalAverageWeightRatings: string,
  role: string,
  password: string,
  name: string,
  potentialScore: string,
  email: string,
  recentlyActive: {
    seconds: string,
    nanoseconds: string
  },
  numberOfRents: string,
  age: string,
  message: string
}