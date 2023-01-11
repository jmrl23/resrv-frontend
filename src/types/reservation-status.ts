export const ReservationStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  CANCELLED: 'CANCELLED'
}

export type ReservationStatus =
  typeof ReservationStatus[keyof typeof ReservationStatus]
