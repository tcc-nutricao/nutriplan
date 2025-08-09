export function useUtils() {
  const applyMask = (value, mask) => {
    if (!value) return ''
    if (!mask) return value.toString() 

    const cleanValue = value.toString().replace(/\D/g, '')
    let maskedValue = ''
    let cleanIndex = 0

    for (let i = 0; i < mask.length; i++) {
      if (cleanIndex >= cleanValue.length) break

      if (mask[i] === '#') {
        maskedValue += cleanValue[cleanIndex++]
      } else {
        maskedValue += mask[i]
      }
    }

    return maskedValue
  }

  return {
    applyMask
  }
}
