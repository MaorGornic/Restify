import { Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import * as constants from "../utils/constants";

function CustomCarousel({ id }) {
  let lastSlide = 1;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesReq, setImagesReq] = useState([]);
  const getPictures = (searchUrl) => {
    setLoading(true);
    axios
      .get(searchUrl)
      .then((res) => {
        setImagesReq(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  useEffect(() => {
    getPictures(
      `http://127.0.0.1:8000/restaurants/${id}/images/?page=${currentPage}`
    );
  }, [currentPage]);

  return (
    <Carousel
      infiniteLoop
      showArrows={true}
      showThumbs={true}
      onChange={(index) => {
        // If clicked on the right arrow button when at the end
        if (lastSlide + 1 == constants.pageSize && index == 0) {
          lastSlide = 1;
          if (imagesReq.count > 0 && currentPage >= imagesReq.count) return;
          setCurrentPage(currentPage + 1);
          // If clicked on the left arrow button when at the start
        } else if (lastSlide == 0 && index > lastSlide + 1) {
          if (currentPage <= 1) return;
          setCurrentPage(currentPage - 1);
        }

        // Updating the last slide
        lastSlide = index;
      }}
    >
      {imagesReq.count > 0 &&
        imagesReq.results.map((slide, index) => {
          return (
            <Image
              key={index}
              src={slide.ref_img}
              height="70vh"
              maxWidth="100vh"
            />
          );
        })}
    </Carousel>
  );
}

export default CustomCarousel;
