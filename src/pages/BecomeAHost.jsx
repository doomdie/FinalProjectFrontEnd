import { useState } from 'react'
import { StayTypeList } from '../cmps/StayTypeList'
import { AmenitiesPageList } from '../cmps/AmenitiesPageList'
import { ChooseYourLoc } from '../cmps/ChooseYourLoc'
import { GuestMenuPage } from '../cmps/GuestMenuPage'
import { AddImages } from '../cmps/AddImages'
import { useNavigate } from 'react-router-dom'
import { addStay } from '../store/actions/stay.actions'
import { userService } from '../services/user'
import { showErrorMsg } from '../services/event-bus.service'

export function BecomeAHost() {
    const navigate = useNavigate()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        type: '',
        location: null,
        typesList: [],
        capacity: 1,
        imgUrls: [],
        bedrooms: 1,
        bathrooms: 1,
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
        else handleSubmit()
    }

    async function handleSubmit() {
        const loggedinUser = userService.getLoggedinUser()
        if (!loggedinUser) {
            showErrorMsg('You must be logged in to create a listing')
            return
        }

        setIsSubmitting(true)
        try {
            const stayToSave = {
                name: `${formData.type} stay`,
                type: formData.type,
                imgUrls: formData.imgUrls,
                price: 100,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                summary: 'Beautiful stay managed by host...',
                capacity: formData.capacity,
                amenities: formData.typesList,
                labels: [],
                loc: formData.location
                    ? {
                        country: formData.location.country,
                        countryCode: formData.location.countryCode,
                        city: formData.location.city,
                        address: formData.location.address,
                        type: 'Point',
                        coordinates: [formData.location.lng, formData.location.lat],
                    }
                    : {
                        country: '', countryCode: '', city: '', address: '',
                        type: 'Point',
                        coordinates: [0, 0],
                    },
                host: {
                    _id: loggedinUser._id,
                    fullname: loggedinUser.fullname,
                    imgUrl: loggedinUser.imgUrl,
                },
            }
            console.log('location at submit:', JSON.stringify(formData.location))
            await addStay(stayToSave)
            navigate('/')
        } catch (err) {
            console.error('Failed to submit stay', err)
            showErrorMsg('Failed to create listing')
        } finally {
            setIsSubmitting(false)
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
                        currentList={{
                            capacity: formData.capacity,
                            bedrooms: formData.bedrooms,
                            bathrooms: formData.bathrooms,
                        }}
                        onChangeCount={(key, value) => updateFormData(key, value)}
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
                        disabled={(currentStep === 1 && !formData.type) || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : currentStep === totalSteps ? 'Submit' : 'Next'}
                    </button>
                </div>
            </footer>
        </div>
    )
}