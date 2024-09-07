import { format, isToday, isYesterday, parse, parseISO } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'

export const formatDate = (dateString: string) => {
  // Handle special cases first
  if (dateString === 'Today' || dateString === 'Yesterday') {
    return dateString
  }

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

    // Convert to user's timezone
    const zonedDate = new Date(formatInTimeZone(date, userTimeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"))

    if (isToday(zonedDate)) {
      return `Today`
    }
    if (isYesterday(zonedDate)) return 'Yesterday'
    return format(zonedDate, 'MMMM d, yyyy') // Format the date consistently
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
