import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { SvgIcon } from '../services/svg.service.jsx'
import { useIsMobile } from '../customHooks/useIsMobile.js'

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function CustomCarousel({ children, title, linkTo }) {
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideCount, setSlideCount] = useState(0);
    const isMobile = useIsMobile();

    const getSlidesToShowForWidth = (width) => {
        if (width <= 450) return 1;
        if (width <= 600) return 2;
        if (width <= 850) return 3;
        if (width <= 1100) return 4;
        if (width <= 1400) return 5;
        if (width <= 1600) return 6;
        return 7;
    };

    const [slidesToShow, setSlidesToShow] = useState(() => getSlidesToShowForWidth(window.innerWidth));

    useEffect(() => {
        setSlideCount(React.Children.count(children));

        const handleResize = () => {
            setSlidesToShow(getSlidesToShowForWidth(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [children]);

    const renderTitle = () => {
        const titleContent = (
            <>
                {title}
                <span className="title-arrow">
                    <SvgIcon iconName="titleArrow" />
                </span>
            </>
        );

        if (linkTo) {
            return (
                <h2 className="carousel-title">
                    <Link to={linkTo} className="carousel-title-link">
                        {titleContent}
                    </Link>
                </h2>
            );
        }

        return <h2 className="carousel-title">{titleContent}</h2>;
    };

    if (isMobile) {
        return (
            <div className="my-carousel-wrapper mobile-full-bleed">
                <header className="carouselHeader">
                    {renderTitle()}
                </header>

                <div className="mobile-swipe-row">
                    {React.Children.map(children, child => (
                        <div className="mobile-swipe-item">
                            {child}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: slidesToShow,
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
                {renderTitle()}
                <div className="carousel-buttons">
                    <button onClick={handlePrev} disabled={isPrevDisabled}>
                        <SvgIcon iconName="chevronLeft" />
                    </button>
                    <button onClick={handleNext} disabled={isNextDisabled}>
                        <SvgIcon iconName="chevronRight" />
                    </button>
                </div>
            </header>

            <div className="inline-carousel-container">
                <Slider ref={sliderRef} {...settings}>
                    {React.Children.map(children, child => (
                        <div>
                            {child}
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
