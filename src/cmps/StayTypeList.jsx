import { LuHouse, LuBuilding, LuTreePalm, LuTent, LuTrees, LuCompass, LuCoffee, LuShip, LuCaravan, LuCastle, LuMountain, LuBox, LuSprout, LuBedDouble, LuHotel, LuWarehouse, LuLeaf, LuGlobe } from 'react-icons/lu'

const TYPE_MAP = {
    'house': { icon: LuHouse, title: 'House', description: 'A residential building that stands alone.' },
    'apartment': { icon: LuBuilding, title: 'Apartment', description: 'A rental unit inside a larger building.' },
    'villa': { icon: LuTreePalm, title: 'Villa', description: 'A luxurious estate with open spaces.' },
    'cabin': { icon: LuCompass, title: 'Cabin', description: 'A rustic getaway surrounded by nature.' },
    'tent': { icon: LuTent, title: 'Tent', description: 'An outdoor shelter for a classic camping experience.' },
    'treehouse': { icon: LuTrees, title: 'Treehouse', description: 'An elevated stay built among branches.' },
    'barn': { icon: LuWarehouse, title: 'Barn', description: 'A converted traditional agricultural structure.' },
    'bed & breakfast': { icon: LuCoffee, title: 'Bed & breakfast', description: 'A cozy room including hosting hospitality.' },
    'boat': { icon: LuShip, title: 'Boat', description: 'A floating living space anchored on water.' },
    'camper/rv': { icon: LuCaravan, title: 'Camper/RV', description: 'A mobile home ready for vehicular travel.' },
    'casa particular': { icon: LuBuilding, title: 'Casa particular', description: 'A private room hosted in a local home.' },
    'castle': { icon: LuCastle, title: 'Castle', description: 'A grand historic and fortified palace architecture.' },
    'cave': { icon: LuMountain, title: 'Cave', description: 'A unique natural subterranean living environment.' },
    'container': { icon: LuBox, title: 'Container', description: 'An eco-friendly space created from shipping frames.' },
    'cycladic home': { icon: LuTreePalm, title: 'Cycladic home', description: 'A traditional white-washed stone architecture.' },
    'dammuso': { icon: LuWarehouse, title: 'Dammuso', description: 'A stone home with distinct curved roofing.' },
    'dome': { icon: LuGlobe, title: 'Dome', description: 'A modern geometric or spherical eco-structure.' },
    'earth home': { icon: LuLeaf, title: 'Earth home', description: 'A home built into sustainable natural foundations.' },
    'farm': { icon: LuSprout, title: 'Farm', description: 'A home located alongside active rural lands.' },
    'guesthouse': { icon: LuBedDouble, title: 'Guesthouse', description: 'A private detatched outbuilding setup.' },
    'hotel': { icon: LuHotel, title: 'Hotel', description: 'A professional commercial hospitality suite.' }
}

export function StayTypeList({ selectedType, onSelectType }) {
    return (
        <div className="type-section">
            <header className="amenitiesHeader">
                <h3>Which of these best describes your place?</h3>
            </header>

            <div className="type-grid">
                {Object.entries(TYPE_MAP).map(([key, config]) => {
                    const Icon = config.icon
                    const isSelected = key === selectedType

                    return (
                        <div
                            key={key}
                            onClick={() => onSelectType(key)}
                            className={`type-item ${isSelected ? 'selected' : ''}`}
                        >
                            <span className="type-icon">
                                <Icon />
                            </span>
                            <span className="type-text">{config.title}</span>
                            <span className="type-caption">{config.description}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}