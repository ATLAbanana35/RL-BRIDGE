class WebUI {
  constructor(name, onUpdate) {
    this.name = name;
    this.update_function = onUpdate;
    this.elements = {};
    document.title = this.name;
  }
  append(element) {
    this.elements[element.name] = element;
  }
  update(current_page) {
    this.update_function(current_page);
    for (const page in this.elements) {
      if (Object.hasOwnProperty.call(this.elements, page)) {
        const element = this.elements[page];
        document.querySelector(
          "webuipage_" + element.name.toLowerCase()
        ).style.display = "none";

        if (current_page.toLowerCase() == page.toLowerCase()) {
          document.querySelector(
            "webuipage_" + element.name.toLowerCase()
          ).style.display = "block";
        }
      }
    }
  }
  set_footer(data, color) {
    document.querySelector("main").innerHTML += `
    <footer></footer>
    <style>
    footer {
      width: 100%;
      height: 20%;
      position: absolute;
      bottom: 0%;
      margin: 0;
      padding: 0;
      left: 0;
      display: flex;
      background: ${color};
      justify-content: space-between;
      align-content: center;
      flex-wrap: wrap;
      text-align: center;
      font-family: Arial, Helvetica, sans-serif;
    }
    footer webui_footerlink img {
      width: 50px;
    }
  </style>

    `;
    const footer = document.querySelector("main footer");
    this.elements_to_add = [];

    for (let index = 0; index < data.length; index++) {
      footer.innerHTML += `
        <WebUI_footerLink class="WebUIlink_${data[index]["name"]}">
        <img src="${data[index]["svg"]}"></img>
        <h3 style="margin:0;padding:0;">${data[index]["name"]}</h3>
        </WebUI_footerLink>
        `;
      this.elements_to_add.push(data[index]["name"]);
    }
    for (
      let element_to = 0;
      element_to < this.elements_to_add.length;
      element_to++
    ) {
      const element = this.elements_to_add[element_to];
      document
        .querySelector(`.WebUIlink_${element}`)
        .addEventListener("click", () => {
          this.update(element);
        });
    }
  }
}

class WebUIPage {
  constructor(name_xyz) {
    this.name = name_xyz;
    this.htmlElement = `WebUIPage_${this.name}`;
    document.querySelector("main").innerHTML += `
    <WebUIPage_${this.name}></WebUIPage_${this.name}>
    `;
  }
  set_elements(data) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      document.querySelector("main WebUIPage_" + this.name).innerHTML += `
      <WebUIPage_${this.name}_element_${element["name"]} style="font-family: Arial; text-align: center;">
      <h2>${element["name"]}</h2>
      <content>
      ${element["html"]}
      </content>
      </WebUIPage_${this.name}_element_${element["name"]}>
      `;
    }
  }
}
