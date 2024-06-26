const { createApp } = Vue;

createApp({
  data() {
    return {
      searchQuery: '',
      artists: [],
      genres: [],
      selectedGenres: [],
      sortOption: 'original'
    }
  },
  computed: {
    sortedArtists() {
      if (this.sortOption === 'original') {
        return this.artists;
      } else if (this.sortOption === 'collectionName') {
        return this.artists.slice().sort((a, b) => a.collectionName.localeCompare(b.collectionName));
      } else if (this.sortOption === 'price') {
        return this.artists.slice().sort((a, b) => a.trackPrice - b.trackPrice);
      }
    }
  },
  methods: {
    searchArtists() {
      if (this.searchQuery.trim() === '') {
        alert('Please enter a keyword to search artists.');
        return;
      }

      const encodedQuery = encodeURIComponent(this.searchQuery.trim());
      const url = `https://itunes.apple.com/search?term=${encodedQuery}&entity=musicTrack&limit=50`;

      axios.get(url)
        .then(response => {
          console.log(response.data);
          this.artists = response.data.results.filter(artist => artist.artistName.toLowerCase().includes(this.searchQuery.toLowerCase()));
          this.updateGenres();
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
      this.selectedGenres = [];
      this.searchArtists();
    },
    updateGenres() {
      const allGenres = this.artists.flatMap(artist => artist.primaryGenreName.split(','));
      const uniqueGenres = [...new Set(allGenres)];
      const genresInResults = uniqueGenres.filter(genre => {
        return this.artists.some(artist => artist.primaryGenreName.includes(genre));
      });
      this.genres = genresInResults;
    },
    toggleGenre(genre) {
      if (genre === 'ALL') {
        this.selectedGenres = [];
      } else {
        const index = this.selectedGenres.indexOf(genre);
        if (index === -1) {
          this.selectedGenres.push(genre);
        } else {
          this.selectedGenres.splice(index, 1);
          if (this.selectedGenres.length === 0) {
            this.selectedGenres = [];
          }
        }
      }
    },
    isSelectedGenre(genre) {
      return genre === 'ALL' ? this.selectedGenres.length === 0 : this.selectedGenres.includes(genre);
    },
    sortResults(option) {
      this.sortOption = option;
    }
  }
}).mount('#app');