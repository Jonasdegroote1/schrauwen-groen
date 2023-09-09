(() => {
  const app = {
    initialize() {
      this.cacheElements();
      this.buildUI();
    },
    cacheElements() {
      this.$references = document.getElementById("references");
    },
    buildUI() {
      this.$references.innerHTML = this.generateHTMLForReferencesCards();
    },

    getTitleForType(type) {
      switch (type) {
        case "b2b":
          return "Zakelijke omgeving";
        case "private":
          return "Privé omgeving";
        case "public":
          return "Openbare omgeving";
        default:
          return "";
      }
    },

    generateHTMLForReferencesCards() {
      const types = [...new Set(REFERENCES.map((x) => x.type))];

      return types
        .map((type) => {
          const referencesByType = REFERENCES.filter(
            (reference) => reference.type === type
          );
          return `
          <div class="section__${type}">
        <h2 id="${type}">${this.getTitleForType(type)} </h2>
        <ul class="references ">
        ${referencesByType
          .map((reference) => {
            return `
                    <li class="cards__references" id="${reference.id}">
                    <img src="${reference.image}" alt="">
                    <p>${reference.description}</p>
                    </li>`;
          })
          .join("")}
        </ul>
        </div>`;
        })
        .join("");
    },
  };
  app.initialize();
})();
