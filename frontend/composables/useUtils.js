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

  const getISODateString = (dateString, startOfDay = true) => {
    const date = new Date(dateString.split('/').reverse().join('-'));
    
    if (startOfDay) {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(23, 59, 59, 999);
    }
    
    return date.toISOString();
  }

  const formatISODate = (isoString) => {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  return {
    applyMask,
    getISODateString,
    formatISODate
  }
}
