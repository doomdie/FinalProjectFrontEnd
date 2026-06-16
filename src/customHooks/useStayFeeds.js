import { useMemo } from 'react';

export function useStayFeeds(stays = []) {
    const topRatedStays = useMemo(() => {
        return stays.filter(stay => {
            if (!stay.reviews || !stay.reviews.length) return false;
            const totalRating = stay.reviews.reduce((sum, review) => sum + (review.rate || 0), 0);
            const avgRating = totalRating / stay.reviews.length;
            return avgRating >= 4.5; 
        });
    }, [stays]);

    const eilatStays = useMemo(() => {
        return stays.filter(stay => {
            return stay.loc && stay.loc.city && stay.loc.city.toLowerCase() === 'eilat';
        });
    }, [stays]);

    return {
        topRatedStays,
        eilatStays,
        allStays: stays
    };
}