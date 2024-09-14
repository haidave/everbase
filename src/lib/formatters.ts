import { format, isToday, isYesterday, parse, parseISO } from 'date-fns'

export const formatDate = (dateString: string) => {
  let date: Date

  // Try parsing as ISO string first
  date = parseISO(dateString)

  // If invalid, try parsing as 'MMMM d, yyyy'
  if (isNaN(date.getTime())) {
    date = parse(dateString, 'MMMM d, yyyy', new Date())
  }

  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMMM d, yyyy')
}

export const formatTime = (dateString: string) => {
  const date = parseISO(dateString)
  return format(date, 'HH:mm')
}
