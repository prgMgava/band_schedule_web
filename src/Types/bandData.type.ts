export interface BandData {
  name: string
  contact: string
  whatsapp: string
  logo: JSX.Element
  id: string
  presKitLink: string
  description: string
  midias: BandMidia[]
}

export interface BandMidia {
  name: string
  link: string
  icon: JSX.Element
}
