/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react"
import "./landingPage.style.css"
import ReactCarousel, { AFTER, CENTER, BEFORE } from "react-carousel-animated"
import "react-carousel-animated/dist/style.css"

import { MidiaContainer } from "../Components/LandingPage/MidiaContainer"
import { bandData } from "../data/bandData"
export const LandingPage = () => {
  const viewPortHeight = window.innerHeight
  const Video = require("../assets/videos/naMedidaVideo.mp4")
  const Logo = require("../assets/images/logo.webp")

  return (
    <div className="main-container">
      <section className="section1">
        <div className="brand-container" style={{ height: `${viewPortHeight}px` }}>
          <img src={Logo} alt="Logo, onibus vermelho" className="logo-bus"></img>
        </div>
        <div className="parallax-video">
          <video autoPlay loop muted>
            <source src={Video} type="video/mp4" />
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
                      Contato para shows: <br />
                      {band.contact}
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
