import { useState } from 'react'
import { StayTypeList } from '../cmps/StayTypeList'
import { AmenitiesPageList } from '../cmps/AmenitiesPageList'
import { ChooseYourLoc } from '../cmps/ChooseYourLoc'
import { GuestMenuPage } from '../cmps/GuestMenuPage'
export function BecomeAHost() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        type: '',
        location: null,
        typesList: []
    })
    const totalSteps = 4

    function updateFormData(key, value) {
        setFormData(prev => ({ ...prev, [key]: value }))
    }
    function handleToggleMultiType(val) {
        setFormData(prev => {
            const isAlreadySelected = prev.typesList.includes(val)
            const updatedList = isAlreadySelected
                ? prev.typesList.filter(item => item !== val)
                : [...prev.typesList, val]
            console.log(formData)
            return { ...prev, typesList: updatedList }
        })
    }
    function handleNext() {
        if (currentStep < totalSteps) setCurrentStep(prev => prev + 1)
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

                    />

                )}
                {currentStep === 4 && (
                    <GuestMenuPage

                    />

                )} </main>
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