import { useState } from 'react'
import { StayTypeList } from '../cmps/StayTypeList'
import { AmenitiesPageList } from '../cmps/AmenitiesPageList'
import { ChooseYourLoc } from '../cmps/ChooseYourLoc'
import { GuestMenuPage } from '../cmps/GuestMenuPage'
import { AddImages } from '../cmps/AddImages'
import { useNavigate } from 'react-router-dom'
import { addStay } from '../store/actions/stay.actions'

export function BecomeAHost() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        type: '',
        location: null,
        typesList: [],
        capacity: 1,
        imgUrls: []
    })
    const totalSteps = 5

    function updateFormData(key, value) {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    function handleToggleMultiType(val) {
        setFormData(prev => {
            const isAlreadySelected = prev.typesList.includes(val)
            const updatedList = isAlreadySelected
                ? prev.typesList.filter(item => item !== val)
                : [...prev.typesList, val]
            return { ...prev, typesList: updatedList }
        })
    }

    function handleNext() {
        if (currentStep < totalSteps) setCurrentStep(prev => prev + 1)
        else {
            handleSubmit()
        }
    }

    async function handleSubmit() {
        console.log(formData)
        try {
            const stayToSave = {
                name: `${formData.type} stay`,
                type: formData.type,
                imgUrls: formData.imgUrls,
                price: 100,
                summary: 'Beautiful stay managed by host...',
                capacity: formData.capacity,
                amenities: formData.typesList,
                labels: [],
                loc: formData.location || {
                    country: '',
                    countryCode: '',
                    city: '',
                    address: '',
                    lat: 0,
                    lng: 0
                }
            }
            await addStay(stayToSave)
            navigate('/')
        } catch (err) {
            console.error('Failed to submit stay', err)
        }
    }

    function handleBack() {
        if (currentStep > 1) setCurrentStep(prev => prev - 1)
    }

    return (
        <div className="flow-wrapper">
            <main className="flow-main">
                {currentStep === 1 && (
                    <StayTypeList
                        selectedType={formData.type}
                        onSelectType={(val) => updateFormData('type', val)}
                    />
                )}
                {currentStep === 2 && (
                    <AmenitiesPageList
                        selectedTypes={formData.typesList}
                        onToggleType={handleToggleMultiType}
                    />
                )}
                {currentStep === 3 && (
                    <ChooseYourLoc
                        onSelectLocation={(loc) => updateFormData('location', loc)}
                    />
                )}
                {currentStep === 4 && (
                    <GuestMenuPage
                        onUpdateCapacity={(capacity) => updateFormData('capacity', capacity)}
                    />
                )}
                {currentStep === 5 && (
                    <AddImages
                        imgUrls={formData.imgUrls}
                        onUpdateImages={(urls) => updateFormData('imgUrls', urls)}
                    />
                )}
            </main>
            <footer className="flow-footer">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
                <div className="footer-controls">
                    <button
                        onClick={handleBack}
                        className="back-btn"
                        style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                    >
                        Back
                    </button>
                    <button
                        onClick={handleNext}
                        className="next-btn"
                        disabled={currentStep === 1 && !formData.type}
                    >
                        {currentStep === totalSteps ? 'Submit' : 'Next'}
                    </button>
                </div>
            </footer>
        </div>
    )
}