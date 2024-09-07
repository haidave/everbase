import { format, isToday, isYesterday, parse, parseISO } from 'date-fns'

export const formatDate = (dateString: string) => {
  const date = parse(dateString, 'MMMM d, yyyy', new Date())
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return dateString
}

export const formatTime = (dateString: string) => {
  const date = parseISO(dateString)
  return format(date, 'HH:mm')
}
