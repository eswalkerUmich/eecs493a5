const { createApp } = Vue;

createApp({
  data() {
    return {
      searchQuery: '',
      artists: [],
      genres: [],
      selectedGenres: []
    }
  },
  computed: {
    filteredArtists() {
      if (this.selectedGenres.length === 0) {
        return this.artists;
      } else {
        return this.artists.filter(artist => {
          return this.selectedGenres.some(genre => artist.genre.includes(genre));
        });
      }
    }
  },
  methods: {
    searchArtists() {
      if (this.searchQuery.trim() === '') {
        alert('Please enter a keyword to search artists.');
        return;
      }

      const url = `https://itunes.apple.com/search?term=${this.searchQuery}&entity=musicTrack&limit=50`;

      axios.get(url)
        .then(response => {
          console.log(response.data);
          this.artists = response.data.results;
          if (this.artists.length === 0) {
            alert(`Total ${this.artists.length} artists found.`);
          }
        })
        .catch(error => {
          console.error('Error fetching artists:', error);
          alert('An error occurred while fetching artists. Please try again.');
        });
    },
    getAllArtists() {
      const url = 'https://itunes.apple.com/search?term=&entity=musicTrack&limit=50';

      axios.get(url)
        .then(response => {
          console.log(response.data);
          this.artists = response.data.results;
          alert(`Total ${this.artists.length} artists found.`);
        })
        .catch(error => {
          console.error('Error fetching artists:', error);
          alert('An error occurred while fetching artists. Please try again.');
        });
    },
    toggleGenre(genre) {
      if (this.selectedGenres.includes(genre)) {
        const index = this.selectedGenres.indexOf(genre);
        this.selectedGenres.splice(index, 1);
      } else {
        this.selectedGenres.push(genre);
      }
    }
  }
}).mount('#app');