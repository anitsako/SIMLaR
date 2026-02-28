export function dmsToDecimal(deg: number, min: number, sec: number, dir: 'N' | 'S' | 'E' | 'O'): number {
  const decimal = deg + min / 60 + sec / 3600;
  return dir === 'S' || dir === 'O' ? -decimal : decimal;
}

export function dmsStringToDecimal(deg: string, min: string, sec: string, dir: 'N' | 'S' | 'E' | 'O'): number {
  const decimal = Number(deg) + Number(min) / 60 + Number(sec) / 3600;
  return dir === 'S' || dir === 'O' ? -decimal : decimal;
}
