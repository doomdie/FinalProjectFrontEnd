import { LuHouse, LuBuilding, LuTreePalm, LuTent, LuTrees, LuCompass, LuCoffee, LuShip, LuCaravan, LuCastle, LuMountain, LuBox, LuSprout, LuBedDouble, LuHotel, LuWarehouse, LuLeaf, LuGlobe } from 'react-icons/lu'

const TYPE_MAP = {
    'house': { icon: LuHouse, title: 'House' },
    'apartment': { icon: LuBuilding, title: 'Apartment' },
    'villa': { icon: LuTreePalm, title: 'Villa' },
    'cabin': { icon: LuCompass, title: 'Cabin' },
    'tent': { icon: LuTent, title: 'Tent' },
    'treehouse': { icon: LuTrees, title: 'Treehouse' },
    'barn': { icon: LuWarehouse, title: 'Barn' },
    'bed & breakfast': { icon: LuCoffee, title: 'Bed & breakfast' },
    'boat': { icon: LuShip, title: 'Boat' },
    'camper/rv': { icon: LuCaravan, title: 'Camper/RV' },
    'casa particular': { icon: LuBuilding, title: 'Casa particular' },
    'castle': { icon: LuCastle, title: 'Castle' },
    'cave': { icon: LuMountain, title: 'Cave' },
    'container': { icon: LuBox, title: 'Container' },
    'cycladic home': { icon: LuTreePalm, title: 'Cycladic home' },
    'dammuso': { icon: LuWarehouse, title: 'Dammuso' },
    'dome': { icon: LuGlobe, title: 'Dome' },
    'earth home': { icon: LuLeaf, title: 'Earth home' },
    'farm': { icon: LuSprout, title: 'Farm' },
    'guesthouse': { icon: LuBedDouble, title: 'Guesthouse' },
    'hotel': { icon: LuHotel, title: 'Hotel' }
}

export function BecomeAHost() {
    return (
        <div className="type-section">
            <h3>Which of these best describes your place?</h3>
            
            <div className="type-grid">
                {Object.entries(TYPE_MAP).map(([key, config]) => {
                    const Icon = config.icon

                    return (
                        <div key={key} className="type-item">
                            <span className="type-icon">
                                <Icon />
                            </span>
                            <span className="type-text">{config.title}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}