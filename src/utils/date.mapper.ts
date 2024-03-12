export class DateMapper {
  static stringToDate(date: string): Date {
    const year = Number(date.substring(0, 4));
    const month = Number(date.substring(5, 7));
    const day = Number(date.substring(8, 10));
    const hour = Number(date.substring(11, 13));
    const result = new Date(year, month - 1, day, hour);
    return result;
  }
}
