const axios = require('axios');

const baseURL = 'https://api.mangadex.org'

const getMangaList = async (title) => {
    try {
        // Gets a list of related manga based on the title
        const res = await axios.get(`${baseURL}/manga`, {
            params: {
                title: title
            }
        })
        // Maps out all the ids into a list
        const mangaIds = res.data.data.map(manga => manga.id)

        // Calls getMangaDetails function which is asynchronous for each mangaIds' list item
        const mangaDetailsPromises = mangaIds.map(async (id) => {
            const details = await getMangaDetails(id)
            return details.data
        })
        // Tells code to wait for all promise to finish before continuing
        const mangaDetails = await Promise.all(mangaDetailsPromises)
        

    } catch(error) {
        console.error(error)
    }

}

// Function to get manga details from manga id  
const getMangaDetails = async (id) => {
    try {
        const res = await axios.get(`${baseURL}/manga/${id}`)
        return res
    } catch(error) {
        console.error(error)
    }
    

}

// Function to get author from author id
const getAuthor = async (id) => {
    try{
        const res = await axios.get(`${baseURL}/author/${id}`)
        return res
    } catch(error) {
        console.error(error)
    }
}

// Test function
getMangaList("Dragon Ball")