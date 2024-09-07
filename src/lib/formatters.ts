import { isToday, isYesterday, parse, parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export const formatDate = (dateString: string) => {
  try {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    let date: Date

    // First, try to parse as ISO date
    date = parseISO(dateString)

    // If parsing as ISO fails, try to parse as "MMMM d, yyyy" format
    if (isNaN(date.getTime())) {
      date = parse(dateString, 'MMMM d, yyyy', new Date())
    }

    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString)
      return dateString // Return the original string if parsing fails
    }

    if (isToday(date)) {
      const now = new Date()
      const currentTime = formatInTimeZone(now, userTimeZone, 'HH:mm')
      return `Today (Current time: ${currentTime})`
    }
    if (isYesterday(date)) return 'Yesterday'
    return dateString // Return the original formatted string
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString // Return the original string in case of any error
  }
}

export const formatTime = (dateString: string) => {
  try {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const date = parseISO(dateString)

    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString)
      return 'Invalid Time'
    }

    return formatInTimeZone(date, userTimeZone, 'HH:mm')
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Error formatting time'
  }
}
