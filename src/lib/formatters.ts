import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isToday)
dayjs.extend(isYesterday)

export const formatDateClient = (dateString: string) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const date = dayjs(dateString).tz(userTimeZone)

  if (date.isToday()) {
    return 'Today'
  }
  if (date.isYesterday()) {
    return 'Yesterday'
  }
  return date.format('MMMM D, YYYY')
}

export const formatDateServer = (dateString: string) => {
  return dayjs(dateString).utc().format('YYYY-MM-DD')
}

export const formatTime = (dateString: string) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  return dayjs(dateString).tz(userTimeZone).format('HH:mm')
}
