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
    filteredArtists() {
      if (this.selectedGenres.length === 0) {
        return this.artists.filter(artist => artist.artistName.toLowerCase().includes(this.searchQuery.toLowerCase()));
      } else {
        return this.artists.filter(artist => {
          const artistGenres = artist.primaryGenreName.split(',');
          return artistGenres.some(genre => this.selectedGenres.includes(genre)) && artist.artistName.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
      }
    },
    sortedArtists() {
      if (this.sortOption === 'original') {
        return this.filteredArtists;
      } else if (this.sortOption === 'collectionName') {
        return this.filteredArtists.slice().sort((a, b) => a.collectionName.localeCompare(b.collectionName));
      } else if (this.sortOption === 'price') {
        return this.filteredArtists.slice().sort((a, b) => a.trackPrice - b.trackPrice);
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
      const url = 'https://itunes.apple.com/search?term=&entity=musicTrack&limit=50';

      axios.get(url)
        .then(response => {
          console.log(response.data);
          this.artists = response.data.results;
          this.updateGenres();
          alert(`Total ${this.artists.length} artists found.`);
        })
        .catch(error => {
          console.error('Error fetching artists:', error);
          alert('An error occurred while fetching artists. Please try again.');
        });
    },
    updateGenres() {
      const allGenres = this.artists.flatMap(artist => artist.primaryGenreName.split(','));
      this.genres = [...new Set(allGenres)];
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