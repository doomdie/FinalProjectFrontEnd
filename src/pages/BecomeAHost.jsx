import { useState } from 'react'
import { StayTypeList } from '../cmps/StayTypeList'
import { AmenitiesPageList } from '../cmps/AmenitiesPageList'
export function BecomeAHost() {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        type: '',
        location: null,
        typesList: []
    })
    const totalSteps = 3

    function updateFormData(key, value) {
        setFormData(prev => ({ ...prev, [key]: value }))
    }
    function handleToggleMultiType(val) {
        console.log("1. Parent received toggle for:", val)
        setFormData(prev => {
            const isAlreadySelected = prev.typesList.includes(val)
            const updatedList = isAlreadySelected
                ? prev.typesList.filter(item => item !== val)
                : [...prev.typesList, val]

            console.log("2. New updated array state will be:", updatedList)
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