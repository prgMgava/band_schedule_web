import uuid from "react-uuid"
import { BandMidia } from "../../Types/bandData.type"

interface MidiaContainerProps {
  midiaData: BandMidia[]
}

export const MidiaContainer = ({ midiaData }: MidiaContainerProps) => {
  return (
    <>
      {midiaData.map(midia => (
        <a href={midia.link} key={midia.name + uuid()} target="blank" className={"custom-a"}>
          {midia.icon}
        </a>
      ))}
    </>
  )
}
