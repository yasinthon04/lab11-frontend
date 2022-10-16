import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getAuctions(perPage, page) {
    return apiClient.get('/auction?_limit=' + perPage + '&_page=' + page)
  },
  getAuction(id) {
    return apiClient.get('/auction/' + id)
  },
  getAuctionByKeyword(keyword, perPage, page) {
    return apiClient.get(
      'auction?_limit=' + perPage + '&_page=' + page + '&description=' + keyword
    )
  }
}
