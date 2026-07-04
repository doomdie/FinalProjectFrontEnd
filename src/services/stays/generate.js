import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Vite/ESM compatibility layout helpers to locate the json file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. UPDATE THIS PATH to point directly to your stays.json file
const jsonFilePath = path.join(__dirname, 'stay.json')
try {
    const rawData = fs.readFileSync(jsonFilePath, 'utf-8')
    const stays = JSON.parse(rawData)

    // Authentic, weighted rating spread
    const weights = [3, 4, 4, 4, 5, 5, 5, 5, 5, 5]

    const fixedStays = stays.map(stay => {
        if (!stay.reviews || !Array.isArray(stay.reviews)) return stay
        
        stay.reviews = stay.reviews.map(review => ({
            ...review,
            // Only inject if it doesn't already have a rate
            rate: review.rate !== undefined ? review.rate : weights[Math.floor(Math.random() * weights.length)]
        }))
        return stay
    })

    // Write the modified data back into the hardcoded JSON file cleanly formatted
    fs.writeFileSync(jsonFilePath, JSON.stringify(fixedStays, null, 2), 'utf-8')
    console.log('🔥 SUCCESS! stays.json has been permanently patched with unique review ratings!')

} catch (err) {
    console.error('Error processing the JSON file:', err)
}