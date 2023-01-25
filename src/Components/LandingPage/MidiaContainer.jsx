import uuid from "react-uuid";

export const MidiaContainer = ({ midiaData }) => {
  return (
    <>
      {midiaData.map((midia, index) => (
        <a href={midia.link} key={midia.name + uuid()} target="blank">
          {midia.icon}
        </a>
      ))}
    </>
  );
};
