export interface LunarDateInfo {
  day: number
  month: number
  year: number
  leap: boolean
  jd: number
}

// More accurate Vietnamese lunar calendar conversion
// Based on the official Vietnamese lunar calendar algorithms

const PI = Math.PI

function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12)
  const y = yy + 4800 - a
  const m = mm + 12 * a - 3
  let jd =
    dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083
  }
  return jd
}

function jdToDate(jd: number): { day: number; month: number; year: number } {
  let a, b, c
  if (jd > 2299160) {
    a = jd + 32044
    b = Math.floor((4 * a + 3) / 146097)
    c = a - Math.floor((b * 146097) / 4)
  } else {
    b = 0
    c = jd + 32082
  }
  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor((1461 * d) / 4)
  const m = Math.floor((5 * e + 2) / 153)
  const day = e - Math.floor((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * Math.floor(m / 10)
  const year = b * 100 + d - 4800 + Math.floor(m / 10)
  return { day, month, year }
}

function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85
  const T2 = T * T
  const T3 = T2 * T
  const dr = PI / 180
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr)
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M)
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr)
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr)
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr))
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M))
  C1 = C1 - 0.0006 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr))
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M))
  let deltat
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2
  }
  const JdNew = Jd1 + C1 - deltat
  return Math.floor(JdNew + 0.5 + timeZone / 24)
}

function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24) / 36525
  const T2 = T * T
  const dr = PI / 180
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M)
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M)
  let L = L0 + DL
  L = L * dr
  L = L - PI * 2 * Math.floor(L / (PI * 2))
  return Math.floor((L / PI) * 6)
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021
  const k = Math.floor(off / 29.530588853)
  let nm = getNewMoonDay(k, timeZone)
  const sunLong = getSunLongitude(nm, timeZone)
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone)
  }
  return nm
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5)
  let last = 0
  let i = 1
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)
  do {
    last = arc
    i++
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone)
  } while (arc !== last && i < 14)
  return i - 1
}

/**
 * Accurately converts a Solar date to a Vietnamese Lunar date.
 * This implementation correctly calculates the lunar month boundaries, ensuring
 * that each month has the correct number of days (29 or 30).
 */
export function getSolarToLunar(date: Date, timeZone: number = 7): LunarDateInfo {
  const targetJD = jdFromDate(date.getDate(), date.getMonth() + 1, date.getFullYear());

  // Find k for the new moon that starts the current lunar month
  let k = Math.floor((targetJD - 2415020.75933) / 29.53058868);
  let nm = getNewMoonDay(k, timeZone);
  while (nm > targetJD) {
    k--;
    nm = getNewMoonDay(k, timeZone);
  }
  while (getNewMoonDay(k + 1, timeZone) <= targetJD) {
    k++;
  }
  nm = getNewMoonDay(k, timeZone);

  // The lunar day is the number of days since the new moon.
  const lunarDay = targetJD - nm + 1;

  // Determine the lunar year, month, and leap status
  const solarDateOfNewMoon = jdToDate(nm);
  
  // A lunar year 'Y' is the one that has its Tet (New Year) in the solar year 'Y'.
  // We find the anchor point, which is the 11th month of the *previous* lunar year.
  let lunarYear = solarDateOfNewMoon.year;
  let nm11 = getLunarMonth11(lunarYear - 1, timeZone);
  let k11 = Math.round((nm11 - 2415021.076998695) / 29.530588853);
  
  // Tet is the first day of the first lunar month, which is the 2nd new moon after the 11th month's new moon.
  let tet = getNewMoonDay(k11 + 2, timeZone);

  if (nm < tet) {
    lunarYear = lunarYear - 1;
    nm11 = getLunarMonth11(lunarYear - 1, timeZone);
    k11 = Math.round((nm11 - 2415021.076998695) / 29.530588853);
  }

  // Find if there's a leap month in this lunar year and where it is.
  const leapMonthOffset = getLeapMonthOffset(nm11, timeZone); // this is the index of the first month in a pair with same sun longitude
  
  const monthIdx = k - k11; // Number of months since the 11th month new moon.

  let lunarMonth;
  let isLeap = false;
  
  let effectiveMonthIdx = monthIdx;
  
  if (leapMonthOffset > 0) {
      const leapMonthIdx = leapMonthOffset;
      if (monthIdx > leapMonthIdx) {
          effectiveMonthIdx--;
      } else if (monthIdx === leapMonthIdx) {
          isLeap = true;
          // The leap month has the same number as the previous month, so we take the index of the month before.
          effectiveMonthIdx = monthIdx -1;
      }
  }

  // Convert the effective month index to a month number (1-12)
  // monthIdx 0 => month 11
  // monthIdx 1 => month 12
  // monthIdx 2 => month 1
  if (effectiveMonthIdx < 2) {
      lunarMonth = 11 + effectiveMonthIdx;
  } else {
      lunarMonth = effectiveMonthIdx - 1;
  }
  
  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: isLeap,
    jd: targetJD,
  };
}

export function getLunarToSolar(day: number, month: number, year: number, leap = false): Date {
  const timeZone = 7 // For Vietnam (GMT+7)
  
  const jdMonth11 = getLunarMonth11(year, timeZone)
  const k11 = Math.floor((jdMonth11 - 2415021.076998695) / 29.530588853 + 0.5)
  
  let targetMonthJD = 0
  let foundMonth = false
  
  for (let m = 1; m <= 14; m++) {
    const nm = getNewMoonDay(k11 + m - 1, timeZone)
    const nextNm = getNewMoonDay(k11 + m, timeZone)
    
    let currentLunarMonth = m - 1
    let isLeap = false
    
    const sunLong = getSunLongitude(nm, timeZone)
    const nextSunLong = getSunLongitude(nextNm, timeZone)
    
    if (sunLong === nextSunLong) {
        if(month -1 === m-1-1 && leap){
            isLeap = true;
            currentLunarMonth = m-1-1;
        }
    }
    
    if (currentLunarMonth <= 0) currentLunarMonth += 12
    if(currentLunarMonth === 11 && m > 5) currentLunarMonth = m-1-1;
    if(currentLunarMonth === 12 && m > 5) currentLunarMonth = m-1-1;
    
    if (currentLunarMonth === month && isLeap === leap) {
      targetMonthJD = nm
      foundMonth = true
      break
    }
  }
  
  if (!foundMonth) {
    const approximateK = k11 + month - 11
    targetMonthJD = getNewMoonDay(approximateK, timeZone)
  }
  
  const targetJD = targetMonthJD + day - 1
  const solarDate = jdToDate(targetJD)
  
  return new Date(solarDate.year, solarDate.month - 1, solarDate.day)
}

export function getLunarMonthName(month: number, leap = false): string {
  const monthNames = ["Giêng", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Một", "Chạp"]
  return `${leap ? "Nhuận " : ""}${monthNames[month - 1]}`
}

export function getLunarYearName(year: number): string {
  const can = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"]
  const chi = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"]

  return `${can[(year + 6) % 10]} ${chi[(year + 8) % 12]}`
}

export function isSpecialLunarDay(day: number, month: number): { isSpecial: boolean; name?: string } {
  if (day === 1 && month === 1) return { isSpecial: true, name: "Tết Nguyên Đán" }
  if (day === 15 && month === 1) return { isSpecial: true, name: "Rằm Tháng Giêng" }
  if (day === 10 && month === 3) return { isSpecial: true, name: "Giỗ Tổ Hùng Vương" }
  if (day === 15 && month === 4) return { isSpecial: true, name: "Lễ Phật Đản" }
  if (day === 5 && month === 5) return { isSpecial: true, name: "Tết Đoan Ngọ" }
  if (day === 15 && month === 7) return { isSpecial: true, name: "Lễ Vu Lan" }
  if (day === 15 && month === 8) return { isSpecial: true, name: "Tết Trung Thu" }
  if (day === 23 && month === 12) return { isSpecial: true, name: "Tiễn Ông Táo" }

  if (day === 1) return { isSpecial: true, name: "Mồng Một" }
  if (day === 15) return { isSpecial: true, name: "Rằm" }

  return { isSpecial: false }
}

export function formatLunarDate(lunarInfo: LunarDateInfo): string {
  return `${lunarInfo.day}/${lunarInfo.month}${lunarInfo.leap ? " (N)" : ""}/${lunarInfo.year}`
}
