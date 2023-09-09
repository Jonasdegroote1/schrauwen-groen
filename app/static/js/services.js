(() => {
  const app = {
    initialize() {
      this.cacheElements();
      this.buildUI();
    },
    cacheElements() {
      this.$services = document.getElementById("services");
      this.$references = document.getElementById("references");
    },
    buildUI() {
      this.$services.innerHTML = this.generateCards(
        this.getFilteredList(this.$services.dataset.type)
      );
      this.$references.innerHTML = this.generateReferenceCards();
    },

    getFilteredList(service) {
      return SERVICES.filter((i) => {
        return i.type === service;
      });
    },

    generateCards(services) {
      return services
        .map((service) => {
          return `
                <li class="cards__services" id="${service.id}">
                <div class="hidden">
                  <img src="${service.image}" alt="">
                </div>
                <h2>${service.title}</h2> 
                <p>${service.description}</p>
                <a href ="#" class="button">Meer informatie</a>
                </li>`;
        })
        .join("");
    },

    generateReferenceCards() {
      return REFERENCES.slice(0, 6)
        .map((reference) => {
          return `
                <li class="cards__references" id="${reference.id}">
                <img src="${reference.image}" alt="">
                <p>${reference.description}</p>
                </li>`;
        })
        .join("");
    },
  };
  app.initialize();
})();
