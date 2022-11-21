export const removeMaskNumber = (cellphoneMasked: string) => {
  if (!cellphoneMasked) {
    return ""
  }
  return cellphoneMasked.replace(/\D/g, "")
}
