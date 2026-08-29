import type { Dayjs, ManipulateType, OpUnitType, QUnitType } from 'dayjs';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/vi';

// Kích hoạt các plugins cần thiết
dayjs.extend(LocalizedFormat);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Cấu hình ngôn ngữ mặc định tiếng Việt cho relative time & locale formatting
dayjs.locale('vi');

export type TimeInput = Date | Dayjs | string | number | null | undefined;

/**
 * Chuyển đổi mọi định dạng đầu vào thành đối tượng Dayjs (ở múi giờ local của trình duyệt)
 */
export const toDayjs = (time: TimeInput): Dayjs => {
  if (!time) return dayjs();
  if (dayjs.isDayjs(time)) return time;

  // Nếu là chuỗi UTC ISO không có 'Z' ở cuối thì xử lý an toàn
  if (typeof time === 'string') {
    const trimmed = time.trim();
    if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/.test(trimmed) && !trimmed.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(trimmed)) {
      return dayjs.utc(trimmed.replace(' ', 'T')).local();
    }
  }

  return dayjs(time);
};

/**
 * Kiểm tra tính hợp lệ của ngày giờ
 */
export const isValidDate = (time: TimeInput): boolean => {
  if (!time) return false;
  return dayjs(time).isValid();
};

// ============================================================================
// 1. NHÓM HÀM HIỂN THỊ CHO NGƯỜI DÙNG (LOCAL TIMEZONE / VI-VN)
// ============================================================================

/**
 * Hiển thị đầy đủ Ngày và Giờ
 * @example formatDateTime("2026-08-28T08:20:30.000Z") => "28/08/2026, 03:20 PM"
 * @example formatDateTime("2026-08-28T08:20:30.000Z", "DD/MM/YYYY HH:mm") => "28/08/2026 15:20"
 */
export const formatDateTime = (
  time: TimeInput,
  format: string = 'DD/MM/YYYY, hh:mm A',
): string => {
  if (!time || !isValidDate(time)) return '—';
  return toDayjs(time).format(format);
};

/**
 * Hiển thị Ngày tháng năm
 * @example formatDate("2026-08-28T08:20:30.000Z") => "28/08/2026"
 */
export const formatDate = (
  time: TimeInput,
  format: string = 'DD/MM/YYYY',
): string => {
  if (!time || !isValidDate(time)) return '—';
  return toDayjs(time).format(format);
};

/**
 * Hiển thị Giờ trong ngày (HH:mm hoặc hh:mm A)
 * @example formatTime("2026-08-28T08:20:30.000Z") => "15:20"
 * @example formatTime("2026-08-28T08:20:30.000Z", true) => "15:20:30"
 */
export const formatTime = (time: TimeInput, withSeconds: boolean = false): string => {
  if (!time || !isValidDate(time)) return '—';
  return toDayjs(time).format(withSeconds ? 'HH:mm:ss' : 'HH:mm');
};

/**
 * Hiển thị Ngày theo văn phong Tiếng Việt
 * @example formatDateVi("2026-08-28") => "28 tháng 8, 2026"
 * @example formatDateVi("2026-08-28", true) => "28 tháng 8 năm 2026"
 */
export const formatDateVi = (time: TimeInput, withYearText: boolean = false): string => {
  if (!time || !isValidDate(time)) return '—';
  const format = withYearText ? 'D [tháng] M [năm] YYYY' : 'D [tháng] M, YYYY';
  return toDayjs(time).format(format);
};

/**
 * Hiển thị thời gian tương đối so với hiện tại (Relative time)
 * @example formatRelativeTime(Date.now() - 1000 * 30) => "Vừa xong"
 * @example formatRelativeTime(Date.now() - 1000 * 60 * 5) => "5 phút trước"
 */
export const formatRelativeTime = (time: TimeInput): string => {
  if (!time || !isValidDate(time)) return '';
  const d = toDayjs(time);
  const now = dayjs();
  const diffSeconds = Math.abs(now.diff(d, 'second'));

  if (diffSeconds < 45) return 'Vừa xong';
  return d.fromNow();
};

/**
 * Lấy tên thứ trong tuần theo ngôn ngữ
 */
export const getWeekdayByLocale = (date: TimeInput, locale: string = 'vi-VN'): string => {
  if (!date || !isValidDate(date)) return '';
  const newDate = toDayjs(date).toDate();
  return newDate.toLocaleDateString(locale, { weekday: 'long' });
};

// ============================================================================
// 2. NHÓM HÀM GỬI LÊN BACKEND / API (UTC / QUERY PARAMS)
// ============================================================================

/**
 * Format ngày dùng cho Filter / Query Param trên API (YYYY-MM-DD)
 * @example formatDateQuery() => "2026-08-28"
 */
export const formatDateQuery = (time: TimeInput = new Date()): string => {
  if (!time || !isValidDate(time)) return '';
  return toDayjs(time).format('YYYY-MM-DD');
};

/**
 * Format Datetime sang chuỗi chuẩn ISO 8601 (UTC) để gửi lên API backend
 * @example formatIsoUtc() => "2026-08-28T08:20:30.000Z"
 */
export const formatIsoUtc = (time: TimeInput = new Date()): string => {
  if (!time || !isValidDate(time)) return '';
  return dayjs(time).utc().toISOString();
};

// ============================================================================
// 3. NHÓM HÀM TÍNH TOÁN & THAO TÁC THỜI GIAN
// ============================================================================

export const getTime = (time: TimeInput): number => toDayjs(time).toDate().getTime();

export const parseDate = (time: string, format: string): Date => dayjs(time, format).toDate();

export const plusTime = (time: TimeInput, quantity: number, unit: ManipulateType = 'day'): Dayjs =>
  toDayjs(time).add(quantity, unit);

export const minusTime = (time: TimeInput, quantity: number, unit: ManipulateType = 'day'): Dayjs =>
  toDayjs(time).subtract(quantity, unit);

export const getDiff = (
  timeStart: TimeInput,
  timeEnd: TimeInput,
  unit: QUnitType | OpUnitType = 'minute',
): number => {
  return toDayjs(timeStart).diff(toDayjs(timeEnd), unit);
};

export const getStartAndEndOfDay = (time: TimeInput = new Date(), format = 'YYYY-MM-DD HH:mm:ss') => ({
  startOfDay: toDayjs(time).startOf('day').format(format),
  endOfDay: toDayjs(time).endOf('day').format(format),
});

export const getStartAndEndOfWeek = (time: TimeInput = new Date(), format = 'YYYY-MM-DD') => ({
  startDate: toDayjs(time).startOf('week').format(format),
  endDate: toDayjs(time).endOf('week').format(format),
});

export const getStartAndEndOfMonth = (time: TimeInput = new Date(), format = 'YYYY-MM-DD') => ({
  startDate: toDayjs(time).startOf('month').format(format),
  endDate: toDayjs(time).endOf('month').format(format),
});

export const isToday = (time: TimeInput): boolean => toDayjs(time).isSame(dayjs(), 'day');
export const isPast = (time: TimeInput): boolean => toDayjs(time).isBefore(dayjs());
export const isFuture = (time: TimeInput): boolean => toDayjs(time).isAfter(dayjs());

/**
 * Kiểm tra chuỗi giờ rác / placeholder (e.g. "00:00:00", "00:00")
 */
export const isGarbageTime = (time?: string | null): boolean => {
  if (!time) return true;
  const cleaned = time.trim().replace(/^0+/, '').replace(/:/g, '');
  return cleaned === '' || cleaned === '0' || cleaned === '00';
};

/**
 * Kiểm tra chuỗi ngày rác / placeholder (e.g. "1900-01-01", "0001-01-01")
 */
export const isGarbageDate = (date?: string | null): boolean => {
  if (!date) return true;
  const d = dayjs(date);
  return !d.isValid() || d.year() < 1970;
};

export default dayjs;
