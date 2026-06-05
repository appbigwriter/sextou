interface GeocodeResult {
  lat: number
  lon: number
}

export async function geocodeAddress(city: string, state: string, country: string = "United States"): Promise<GeocodeResult | null> {
  const apiKey = process.env.GEOAPIFY_API_KEY

  if (!apiKey) {
    console.warn("GEOAPIFY_API_KEY is not defined. Skipping geocoding.")
    return null
  }

  try {
    // Format address for search
    const addressString = `${city}, ${state}, ${country}`
    const encodedAddress = encodeURIComponent(addressString)

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${apiKey}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      console.error(`Geoapify API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data = await response.json()

    if (data.features && data.features.length > 0) {
      const bestMatch = data.features[0].properties
      return {
        lat: bestMatch.lat,
        lon: bestMatch.lon,
      }
    }

    return null
  } catch (error) {
    console.error("Geocoding exception:", error)
    return null
  }
}
