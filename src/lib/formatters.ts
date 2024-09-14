import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

export const formatDate = (dateString: string) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const date = toZonedTime(parseISO(dateString), userTimeZone)

  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMMM d, yyyy')
}

export const formatTime = (dateString: string) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const date = toZonedTime(parseISO(dateString), userTimeZone)
  return format(date, 'HH:mm')
}
