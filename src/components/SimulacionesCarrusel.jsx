import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { SIMULACIONES } from '../data/simulaciones';

function SimulacionesCarrusel() {
  const [imageErrors, setImageErrors] = useState({});

  function PrevArrow({ onClick }) {
    return (
      <button
        type="button"
        className="carousel-arrow carousel-arrow-prev"
        onClick={onClick}
        aria-label="Anterior"
      >
        ‹
      </button>
    );
  }

  function NextArrow({ onClick }) {
    return (
      <button
        type="button"
        className="carousel-arrow carousel-arrow-next"
        onClick={onClick}
        aria-label="Siguiente"
      >
        ›
      </button>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="carousel-shell">
      <style>{`
        .carousel-shell {
          background: #ffffff;
          padding: 22px 0 30px;
        }

        .carousel-card {
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 18px 22px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
        }

        .carousel-header {
          display: none;
        }

        .carousel-media {
          width: 88%;
          margin: 16px auto 0;
        }

        .carousel-media .slick-slider {
          position: relative;
        }

        .carousel-slide {
          padding: 0;
        }

        .carousel-image-frame {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 16px;
          overflow: hidden;
          background: #f8fafc;
          border: 1px solid #e5e7eb;
          box-shadow: 0 8px 18px rgba(0,0,0,0.08);
          transition: transform 220ms ease, box-shadow 220ms ease;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slick-current .carousel-image-frame {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(0,0,0,0.10);
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          padding: 10px;
        }

        .carousel-title-overlay {
          position: absolute;
          left: 14px;
          top: 14px;
          max-width: calc(100% - 28px);
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          padding: 10px 14px;
          color: #093f7c;
          font-weight: 800;
          font-size: 18px;
          line-height: 1.1;
          backdrop-filter: blur(6px);
        }

        .carousel-desc-under {
          width: 88%;
          margin: 10px auto 0;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.5;
          text-align: center;
        }

        .carousel-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-size: 14px;
          font-weight: 600;
        }

        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px;
          height: 46px;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.35);
          background: rgba(17,24,39,0.35);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          line-height: 1;
          cursor: pointer;
          z-index: 5;
          backdrop-filter: blur(6px);
          transition: background 160ms ease, transform 160ms ease;
        }

        .carousel-arrow:hover {
          background: rgba(17,24,39,0.50);
          transform: translateY(-50%) scale(1.03);
        }

        .carousel-arrow-prev {
          left: 12px;
        }

        .carousel-arrow-next {
          right: 12px;
        }

        .carousel-media .slick-dots {
          position: static;
          margin: 14px 0 0;
          padding: 0;
        }

        .carousel-media .slick-dots li {
          margin: 0 6px;
        }

        .carousel-media .slick-dots li button {
          width: 10px;
          height: 10px;
          padding: 0;
        }

        .carousel-media .slick-dots li button:before {
          color: #cbd5e1;
          opacity: 1;
          font-size: 10px;
          line-height: 10px;
          width: 10px;
          height: 10px;
        }

        .carousel-media .slick-dots li.slick-active button:before {
          color: #093f7c;
        }

        @media (max-width: 1024px) {
          .carousel-card {
            margin: 0 14px;
          }

          .carousel-media {
            width: 92%;
          }

          .carousel-title-overlay {
            font-size: 16px;
          }
        }

        @media (max-width: 768px) {
          .carousel-shell {
            padding: 18px 0 36px;
          }

          .carousel-card {
            padding: 16px 14px 18px;
          }

          .carousel-media {
            width: 100%;
            margin-top: 14px;
          }

          .carousel-image {
            padding: 8px;
          }

          .carousel-image-frame {
            aspect-ratio: 4 / 3;
          }

          .carousel-title-overlay {
            left: 10px;
            top: 10px;
            padding: 8px 12px;
            font-size: 15px;
          }

          .carousel-desc-under {
            width: 100%;
            padding: 0 10px;
          }

          .carousel-arrow {
            width: 42px;
            height: 42px;
            font-size: 32px;
          }
        }

        @media (max-width: 480px) {
          .carousel-title-overlay {
            font-size: 14px;
          }

          .carousel-arrow {
            width: 40px;
            height: 40px;
            font-size: 30px;
          }
        }
      `}</style>

      <div className="carousel-card">
        <div className="carousel-media">
          <Slider {...settings}>
            {SIMULACIONES.map((sim) => (
              <div key={sim.id}>
                <div className="carousel-image-frame">
                  <div className="carousel-title-overlay">{sim.nombre}</div>
                  {imageErrors[sim.id] ? (
                    <div className="carousel-placeholder">Imagen no disponible</div>
                  ) : (
                    <img
                      className="carousel-image"
                      src={`/imagenes/${sim.imagen}`}
                      alt={sim.nombre}
                      loading="lazy"
                      onError={() => {
                        setImageErrors((prev) => ({
                          ...prev,
                          [sim.id]: true,
                        }));
                      }}
                    />
                  )}
                </div>
                <div className="carousel-desc-under">{sim.descripcion}</div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default SimulacionesCarrusel;
