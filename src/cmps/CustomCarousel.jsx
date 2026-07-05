import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import { SvgIcon } from '../services/svg.service.jsx'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function CustomCarousel({ children, title }) {
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideCount, setSlideCount] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(7);

    const getSlidesToShowForWidth = (width) => {
        if (width <= 450) return 1;
        if (width <= 600) return 2;
        if (width <= 850) return 3;
        if (width <= 1100) return 4;
        if (width <= 1400) return 5;
        if (width <= 1600) return 6;
        return 7;
    };

    useEffect(() => {
        setSlideCount(React.Children.count(children));
        setSlidesToShow(getSlidesToShowForWidth(window.innerWidth));

        const handleResize = () => {
            setSlidesToShow(getSlidesToShowForWidth(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [children]);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
        draggable: false,
        swipe: false,
        arrows: false,
        beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
        responsive: [
            { breakpoint: 1600, settings: { slidesToShow: 6, slidesToScroll: 1 } },
            { breakpoint: 1400, settings: { slidesToShow: 5, slidesToScroll: 1 } },
            { breakpoint: 1100, settings: { slidesToShow: 4, slidesToScroll: 1 } },
            { breakpoint: 850, settings: { slidesToShow: 3, slidesToScroll: 1, draggable: true, swipe: true } },
            { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1, draggable: true, swipe: true } },
            { breakpoint: 450, settings: { slidesToShow: 1, slidesToScroll: 1, draggable: true, swipe: true } }
        ]
    };

    const handlePrev = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    const handleNext = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const isPrevDisabled = currentSlide === 0;
    const isNextDisabled = currentSlide >= slideCount - slidesToShow;

    return (
        <div className="my-carousel-wrapper">
            <header className="carouselHeader">
                <h2 className="carousel-title">
                    {title}
                    <span className="title-arrow"><SvgIcon iconName="titleArrow" /></span>
                </h2>
                <div className="carousel-buttons">
                    <button onClick={handlePrev} disabled={isPrevDisabled}>
                        <SvgIcon iconName="chevronLeft" />
                    </button>
                    <button onClick={handleNext} disabled={isNextDisabled}>
                        <SvgIcon iconName="chevronRight" />
                    </button>
                </div>
            </header>

            <Slider ref={sliderRef} {...settings}>
                {children}
            </Slider>
        </div>
    );
}