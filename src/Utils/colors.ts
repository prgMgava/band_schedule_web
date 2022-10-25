export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)

    const red = r * 0.299
    const green = g * 0.587
    const blue = b * 0.114
    const sum = red + green + blue
    return sum
  }
  return 0
}
