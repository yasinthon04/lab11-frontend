<template>
  <h1>Search an auction item</h1>

  <div class="events">
    <div class="search-box">
      <BaseInput
        v-model="keyword"
        type="text"
        label="Search..."
        @input="updateKeyword"
      />
    </div>
    <EventCard
      v-for="auction in auctions"
      :key="auction.id"
      :auction="auction"
    ></EventCard>

    <div class="pagination">
      <router-link
        id="page-prev"
        :to="{ name: 'AuctionListView', query: { page: page - 1 } }"
        rel="prev"
        v-if="page != 1"
      >
        Prev Page
      </router-link>

      <router-link
        id="page-next"
        :to="{ name: 'AuctionListView', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
      >
        Next Page
      </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import EventCard from '@/components/EventCard.vue'
//import EventService from '@/services/EventService.js'
import AuctionService from '@/services/AuctionService.js'
export default {
  name: 'AuctionListView',
  props: {
    page: {
      type: Number,
      required: true
    }
  },
  components: {
    EventCard
  },
  data() {
    return {
      auctions: null,
      totalAuctions: 0,
      keyword: null
    }
  },
  // eslint-disable-next-line no-unused-vars
  beforeRouteEnter(routeTo, routeFrom, next) {
    AuctionService.getAuctions(3, parseInt(routeTo.query.page) || 1)
      .then((response) => {
        next((comp) => {
          comp.auctions = response.data
          comp.totalAuctions = response.headers['x-total-count']
        })
      })
      .catch(() => {
        next({ name: 'NetworkError' })
      })
  },
  beforeRouteUpdate(routeTo) {
    //EventService.getEvents(3, parseInt(routeTo.query.page) || 1)
    var queryFunction
    if (this.keyword == null || this.keyword === '') {
      queryFunction = AuctionService.getAuctions(
        3,
        parseInt(routeTo.query.page) || 1
      )
    } else {
      queryFunction = AuctionService.getAuctionByKeyword(
        this.keyword,
        3,
        parseInt(routeTo.query.page) || 1
      )
    }
    queryFunction
      .then((response) => {
        this.auctions = response.data // <---
        this.totalAuctions = response.headers['x-total-count'] // <---
      })
      .catch(() => {
        return { name: 'NetworkError' } // <---
      })
  },
  methods: {
    updateKeyword() {
      var queryFunction
      if (this.keyword === '') {
        queryFunction = AuctionService.getAuctions(3, 1)
      } else {
        queryFunction = AuctionService.getAuctionByKeyword(this.keyword, 3, 1)
      }
      queryFunction
        .then((response) => {
          this.auctions = response.data
          console.log(this.acutions)
          this.totalAuctions = response.headers['x-total-count']
          console.log(this.totalAuctions)
        })
        .catch(() => {
          return { name: 'NetworkError' }
        })
    }
  },
  computed: {
    hasNextPage() {
      let totalPages = Math.ceil(this.totalAuctions / 3)
      return this.page < totalPages
    }
  }
}
</script>
<style scoped>
.events {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pagination {
  display: flex;
  width: 290px;
}
.pagination a {
  flex: 1;
  text-decoration: none;
  color: #2c3e50;
}
#page-prev {
  text-align: left;
}
#page-next {
  text-align: right;
}
.serach-box {
  width: 300px;
}
</style>
