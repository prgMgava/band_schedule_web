/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useRef } from "react"
import "./landingPage.style.css"
import ReactCarousel, { AFTER, CENTER, BEFORE } from "react-carousel-animated"
import "react-carousel-animated/dist/style.css"

import { MidiaContainer } from "../Components/LandingPage/MidiaContainer"
import { bandData } from "../data/bandData"
import { FaWhatsapp } from "react-icons/fa"
import { Finances } from "../Components/Calendar/Components/Finances/Finances"
const LandingPage = () => {
  const viewPortHeight = window.innerHeight
  const PosterVideo = require("../assets/videos/naMedidaVideo.gif")

  const Logo = require("../assets/images/logo.png")

  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }, [videoRef.current])

  return (
    <div className="main-container">
      <section className="section1">
        <div className="brand-container" style={{ height: `${viewPortHeight - 30}px` }}>
          <img src={Logo} alt="Logo, onibus vermelho" className="logo-bus"></img>
        </div>
        <div className="parallax-video" style={{ backgroundColor: "balck" }}>
          <video loop muted ref={videoRef} poster={PosterVideo}>
            Your browser does not support the video tag.
          </video>
          <div className="filter-video"></div>
        </div>
      </section>
      <div className="parallax-content" style={{ height: `${viewPortHeight > 800 ? viewPortHeight : "800"}px` }}>
        <ReactCarousel
          carouselConfig={{
            transform: {
              rotateY: {
                [BEFORE]: () => "rotateY(25deg)",
                [CENTER]: () => "rotateY(0deg)",
                [AFTER]: () => "rotateY(-25deg)",
              },
            },
          }}
          itemBackgroundStyle={{
            backgroundColor: "#000",
            borderRadius: "3px",
            boxShadow: "8px 12px 14px -6px black",
            padding: "16px 16px 0 16px",
            height: "90%",
            width: "80%",
          }}
          containerBackgroundStyle={{}}
          carouselHeight={`${viewPortHeight > 800 ? viewPortHeight : "800"}px`}
        >
          {bandData.map((band, index) => (
            <div key={index} className={`corousel-container ${band.id}`}>
              <img src={band.logo} alt="Nome da banda" className="logo-band"></img>
              <div className="flex">
                <div className="carousel-image"></div>
                <div className="carousel-information">
                  <div className="carousel-content">
                    <div className="content-description">{band.description}</div>
                    <div className="information-tell">
                      <span>Contato para shows:</span> <br />
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <a target="blank" href={`https://wa.me/${band.whatsapp}`} style={{ color: "#fff" }}>
                          {band.contact}
                        </a>
                        <a aria-label="Chat on WhatsApp" href={`https://wa.me/${band.whatsapp}`} target="blank">
                          {" "}
                          <FaWhatsapp color="#25D366" size={"2rem"} />
                        </a>
                      </div>
                    </div>
                    <div className="media-container">
                      <MidiaContainer midiaData={band.midias} />
                    </div>
                    <a href={band.presKitLink} target="blank">
                      <button className="button-52">BAIXAR PRESS KIT</button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ReactCarousel>
      </div>
    </div>
  )
}

export default LandingPage
