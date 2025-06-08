// server/api/reverse-geocode.ts
export default defineEventHandler(async (event) => {
    const { lat, lon } = getQuery(event)
    if (!lat || !lon) {
        return { error: 'lat & lon harus ada!' }
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`

    // Kirim user-agent agar tidak diblok Nominatim
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'YourAppName/1.0 (your@email.com)'
        }
    })

    if (!response.ok) {
        return { error: 'Gagal fetch alamat dari Nominatim' }
    }
    const data = await response.json()
    return data
})
