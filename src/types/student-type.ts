const StudentType = {
  REGULAR: 'REGULAR',
  IRREGULAR: 'IRREGULAR'
}

export type StudentType = typeof StudentType[keyof typeof StudentType]
