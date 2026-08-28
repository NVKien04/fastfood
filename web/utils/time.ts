import type { Dayjs, ManipulateType, OpUnitType, QUnitType } from 'dayjs';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(LocalizedFormat);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const formatTime = (time: Date | Dayjs | string | number, format: string) => dayjs(time).format(format);

export const formatTimeUtc = (time: Date | Dayjs | string | number, format: string) => dayjs.utc(time).format(format);

export const getLocalTime = (time: Date | Dayjs | string | number) => dayjs.utc(time).local();

export const getTime = (time: number | Date | Dayjs) => dayjs(time).toDate().getTime();

export const parseDate = (time: Date | Dayjs | string | number, format: string) => dayjs(time, format).toDate();

export const getStartAndEndOfWeek = (formatDate: string, time: Date | Dayjs | string | number = Date.now()) => ({
  startDate: dayjs(time).startOf('week').format(formatDate),
  endDate: dayjs(time).endOf('week').format(formatDate),
});

export const getDay = (time?: number | Date | Dayjs) => dayjs(time).day();

export const plusDay = (time: Date | Dayjs | string | number, quantity: number, type: ManipulateType = 'day') =>
  dayjs(time).add(quantity, type);

export const getDiffDate = (
  diffFormat: QUnitType | OpUnitType,
  timeStart?: Date | Dayjs | string | number,
  timeEnd?: Date | Dayjs | string | number,
) => {
  return dayjs(timeStart).diff(dayjs(timeEnd), diffFormat);
};

export const getWeekdayByLocale = (date: Date | string | number, locale: string) => {
  const newDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
  const formattedDate = newDate.toLocaleDateString(locale, options);
  return formattedDate;
};

export const formatDateVi = (time: Date | Dayjs | string | number, withYearText = false) => {
  const format = withYearText ? 'D [tháng] M [năm] YYYY' : 'D [tháng] M, YYYY';
  return dayjs(time).format(format);
};

export const currentDate = formatTime(new Date(), 'YYYY-MM-DD');

/**
 * Checks if a time string is a garbage/placeholder value (e.g. "00:00:00", "00:00")
 */
export const isGarbageTime = (time?: string | null): boolean => {
  if (!time) return true;
  const cleaned = time.trim().replace(/^0+/, '').replace(/:/g, '');
  return cleaned === '' || cleaned === '0' || cleaned === '00';
};

/**
 * Checks if a date string is a garbage/placeholder value (e.g. "1900-01-01", "0001-01-01")
 */
export const isGarbageDate = (date?: string | null): boolean => {
  if (!date) return true;
  const d = dayjs(date);
  return !d.isValid() || d.year() < 1970;
};

export const convertTime = (time?: string): string => {
  if (!time) return '';
  const parts = time.split(':');
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : time;
};

export default dayjs;
