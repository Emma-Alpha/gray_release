/**
 * 字节转换函数
 * @param kb
 * @returns
 */
interface FormatSizeUnitsProps {
  kb: number;
  units?: string[];
}
export function formatSizeUnits(props: FormatSizeUnitsProps) {
  const { kb, units = ['KB', 'MB', 'GB', 'TB', 'PB'] } = props;
  let newKb = kb;
  let unitIndex = 0;

  while (kb >= 1024 && unitIndex < units.length - 1) {
    newKb = newKb / 1024;
    unitIndex++;
  }

  return `${kb.toFixed(2)} ${units[unitIndex]}`;
}
