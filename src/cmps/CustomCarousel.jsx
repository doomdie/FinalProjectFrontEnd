import React from 'react';
import { Carousel } from 'react-responsive-carousel';

export function CustomCarousel({ children, itemsPerSlide = 4, selectedItem, onChange }) {
    const childrenArray = React.Children.toArray(children);
    const chunkArray = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const slides = chunkArray(childrenArray, itemsPerSlide);

    return (
        <div className="my-carousel-wrapper">
            <Carousel 
                selectedItem={selectedItem}
                onChange={onChange}
                showThumbs={false} 
                infiniteLoop={true} 
                showArrows={false} 
                showIndicators={false} 
                showStatus={false}
            >
                {slides.map((slideChunk, index) => (
                    <div key={index} className="carousel-grid-slide">
                        {slideChunk}
                    </div>
                ))}
            </Carousel>
        </div>
    );
}