import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaSpotify,
  FaTiktok,
  FaTwitterSquare,
  FaYoutubeSquare,
} from "react-icons/fa";

import LogoBandNaMedida from "../assets/images/naMedidaLogo.webp";

export const bandData = [
  {
    name: "Na Medida",
    contact: "(61) 99533-1001",
    logo: LogoBandNaMedida,
    id: "namedida",
    presKitLink:
      "https://drive.google.com/drive/folders/1gAvjNdFOgMULmHhlyjHVdPYZIgnFabPQ?usp=sharing",
    description:
      "Poder tocar corações e trazer bastante alegria para quem consome nosso som! essa é nossa maior alegria se for assim Tá Na Medida!",
    midias: [
      {
        name: "youtube",
        link: "https://www.youtube.com/channel/UCZSuynr2QA2IYv51tgdZpBA",
        icon: <FaYoutubeSquare className="media-icon" />,
      },
      {
        name: "facebook",
        link: "https://www.facebook.com/Grupotanamedida",
        icon: <FaFacebookSquare className="media-icon" />,
      },
      {
        name: "instagram",
        link: "#",
        icon: <FaInstagramSquare className="media-icon" />,
      },
      {
        name: "spotify",
        link: "#",
        icon: <FaSpotify className="media-icon" />,
      },
      {
        name: "tiktok",
        link: "#",
        icon: <FaTiktok className="media-icon" />,
      },
      {
        name: "twitter",
        link: "#",
        icon: <FaTwitterSquare className="media-icon" />,
      },
    ],
  },
];
