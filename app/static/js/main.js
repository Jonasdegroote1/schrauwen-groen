const WEATHER_GHENT =
  "http://api.weatherapi.com/v1/current.json?key=bae27b6f2faf4e52877132601221412&q=ghent";
const DOG_TOILETS =
  "https://data.stad.gent/api/records/1.0/search/?dataset=hondentoilletten-gent&q=&rows=1000&facet=soort&facet=bestaand";
const PEOPLE = "static/data/pgm.json";

(() => {
  const app = {
    initialize() {
      this.cacheElements();
      this.buildUI();
    },
    cacheElements() {
      this.$weatherDataGhent = document.querySelector(".weather");
      this.$dogToiletsGhent = document.querySelector(".dog__toilets");
      this.$people = document.querySelector(".people");
      this.$search = document.getElementById("formSearch");
      this.$peopleCards = document.querySelector(".people__cards");
      this.$searchOutput = document.getElementById("search__output");
      this.$followers = document.querySelector(".followers");
      this.$repos = document.querySelector(".repos");
    },

    buildUI() {
      this.fetchDogsData();
      this.fetchWeatherData();
      this.fetchPeoplesData();
      this.generateDigitalClock();
      this.searchBar();
      this.generateOverflowPeople();
    },

    getStringForDate(time) {
      return new Date(time).toDateString();
    },

    generateDigitalClock() {
      date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return (document.querySelector(
        ".clock-digital__container"
      ).innerHTML = `<p>The time is ${hours}:${minutes}:${seconds}</p>`);
    },

    fetchWeatherData() {
      getData(WEATHER_GHENT)
        .then((data) => {
          const htmlStr = this.getHTMLForWeather(data.current);
          this.$weatherDataGhent.innerHTML = htmlStr;
        })
        .catch((error) => console.log(error));
    },
    getHTMLForWeather(data) {
      return `
      <h2> ${data.temp_c}°C </h2>
      <img src="${data.condition.icon}">
      <p>${data.wind_kph}Kmh ${data.wind_dir}</p> 
  `;
    },

    fetchDogsData() {
      getData(DOG_TOILETS)
        .then((dog) => {
          const htmlStr = this.getHTMLForDogsData(dog.records);
          this.$dogToiletsGhent.innerHTML = htmlStr;
        })
        .catch((error) => console.log(error));
    },

    getHTMLForDogsData(dog) {
      const tiles = dog.filter(
        (loc) => loc.fields.soort === "Anti-hondenpoeptegel"
      ).length;
      return `
      <p>${tiles}</p>
      <img src="static/images/dog_toilet.png">
      `;
    },

    fetchPeoplesData() {
      getData(PEOPLE)
        .then((persons) => {
          const htmlStr = this.getHTMLForPeopleData(persons);
          this.$people.innerHTML = htmlStr;

          const $items = this.$p.querySelectorAll(".person_detail");

          for (const $item of $items) {
            $item.addEventListener("click", (e) => {
              const id = e.currentTarget.dataset.id;
              // const item = persons.find((person) => {
              //   return person.items.login === id;
              // });
              console.log(id);
            });
          }
        })
        .catch((error) => console.log(error));
    },

    getHTMLForPeopleData(persons) {
      return persons
        .map((person) => {
          return `
          <div class="person_detail" data-id="${person.portfolio.github}" >
            <img src="${person.thumbnail}">
            <div class="persons">
              <h2>${person.portfolio.github}</h2>
              <p>${person.firstName} ${person.name}</p>
            </div>
            
          </div>`;
        })
        .join("");
    },

    generateOverflowPeople() {
      fetch(PEOPLE)
        .then((response) => response.json())
        .then((persons) => {
          const $items = document.querySelectorAll(".person_detail");
          for (const $item of $items) {
            $item.addEventListener("click", (e) => {
              const id = e.currentTarget.dataset.id;
              const item = persons.find((person) => {
                return person.portfolio.github === id;
              });
              console.log(id);
              this.$peopleCards.innerHTML = `
              <div class="details">
              <img src="${item.thumbnail}">
              <h2>${item.firstName} ${item.name}</h2>
              <p class="quote">${item.quote}</p>
              <p>${item.email}</p>
              <p>github user name is ${item.portfolio.github}</p>
              <p>linkedin user name is ${item.portfolio.linkedin}</p>
              <p>Date of birth: ${this.getStringForDate(
                item.dateOfBirth * 1000
              )}</p>
              </div>
              `;

              this.fetchForFollowers(id);
              this.fetchForRepos(id);
            });
          }
        });
    },

    searchBar() {
      this.$search.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(e.currentTarget.elements.search.value);
        this.fetchSearchUser(e.currentTarget.elements.search.value);
      });
    },

    fetchSearchUser(username) {
      getData(
        `https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${username}`
      )
        .then((users) => {
          const htmlStr = this.getHTMLForUsers(users.items);
          this.$searchOutput.innerHTML = htmlStr;

          const $items = this.$searchOutput.querySelectorAll(".person_detail");

          for (const $item of $items) {
            $item.addEventListener("click", (e) => {
              const id = e.currentTarget.dataset.id;
              // const item = persons.find((person) => {
              //   return person.items.login === id;
              // });
              console.log(id);
              this.fetchForDetails(id);
              this.fetchForFollowers(id);
              this.fetchForRepos(id);
            });
          }
        })
        .catch((error) => console.log(error));
    },

    getHTMLForUsers(users) {
      return users
        .map((user) => {
          return `<li class="person_detail" data-id="${user.login}" >
          <img src="${user.avatar_url}">
          <h2>${user.login}</h2>
          </li>
    `;
        })
        .join("");
    },

    fetchForDetails(username) {
      getData(` https://api.github.com/users/${username}`)
        .then((users) => {
          const htmlStr = this.getHTMLForDetails(users);
          this.$peopleCards.innerHTML = htmlStr;
        })
        .catch((error) => console.log(error));
    },

    getHTMLForDetails(users) {
      return `
      <div class="details"> 
      <img src="${users.avatar_url}">
        <h2>${users.login}</h2>
      </div>`;
    },

    fetchForFollowers(username) {
      getData(
        `https://api.github.com/users/${username}/followers?page=1&per_page=100`
      )
        .then((users) => {
          const htmlStr = this.getHTMLForFollowers(users);
          this.$followers.innerHTML = htmlStr;
        })
        .catch((error) => console.log(error));
    },

    getHTMLForFollowers(users) {
      return `<h2>followers</h2>
      ${users
        .map((user) => {
          return `<li class="follower" data-id="${user.login}" >
        <img src="${user.avatar_url}">
        <h2>${user.login}</h2>
        </li>
  `;
        })
        .join("")}`;
    },

    fetchForRepos(username) {
      getData(
        `https://api.github.com/users/${username}/repos?page=1&per_page=50`
      )
        .then((users) => {
          const htmlStr = this.getHTMLForRepos(users);
          this.$repos.innerHTML = htmlStr;
        })
        .catch((error) => console.log(error));
    },

    getHTMLForRepos(users) {
      return `<h2> repos</h2>
      ${users
        .map((user) => {
          return `
        <p>${user.description}</p>
        `;
        })
        .join("")}
      `;
    },
  };
  app.initialize();
})();
