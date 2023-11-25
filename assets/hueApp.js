function xyBriToHex(x, y, bri) {
  z = 1.0 - x - y;
  Y = bri / 255.0; // Brightness of lamp
  X = (Y / y) * x;
  Z = (Y / y) * z;
  r = X * 1.612 - Y * 0.203 - Z * 0.302;
  g = -X * 0.509 + Y * 1.412 + Z * 0.066;
  b = X * 0.026 - Y * 0.072 + Z * 0.962;
  r =
    r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, 1.0 / 2.4) - 0.055;
  g =
    g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, 1.0 / 2.4) - 0.055;
  b =
    b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, 1.0 / 2.4) - 0.055;
  maxValue = Math.max(r, g, b);
  r /= maxValue;
  g /= maxValue;
  b /= maxValue;
  r = r * 255;
  if (r < 0) {
    r = 255;
  }
  g = g * 255;
  if (g < 0) {
    g = 255;
  }
  b = b * 255;
  if (b < 0) {
    b = 255;
  }
  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToXyBri(hex) {
  // Convertir HEX en RGB
  const rgb = hexToRgb(hex);

  // Convertir RGB en XYBri
  return rgbToXyBri(rgb.r, rgb.g, rgb.b);
}

function hexToRgb(hex) {
  // Supprimer le caractère '#' s'il est présent
  hex = hex.replace(/^#/, "");

  // Convertir chaque paire de caractères HEX en décimal
  const bigint = parseInt(hex, 16);

  // Extraire les composantes R, G et B
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

function rgbToXyBri(r, g, b) {
  // Convertir RGB en XY
  const xy = rgbToXy(r, g, b);

  // Luminosité maximale pour Philips Hue est 254
  const bri = Math.max(r, g, b);

  return { xy, bri };
}

function rgbToXy(r, g, b) {
  // Correction gamma inverse
  const gammaCorrect = (value) => {
    value = value / 255.0;
    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  // Correction gamma inverse des composantes R, G et B
  const rGamma = gammaCorrect(r);
  const gGamma = gammaCorrect(g);
  const bGamma = gammaCorrect(b);

  // Conversion des composantes R, G et B vers les coordonnées XYZ
  const X = rGamma * 0.649926 + gGamma * 0.103455 + bGamma * 0.197109;
  const Y = rGamma * 0.234327 + gGamma * 0.743075 + bGamma * 0.022598;
  const Z = rGamma * 0.0 + gGamma * 0.053077 + bGamma * 1.035763;

  // Calcul des coordonnées xy
  let x = X / (X + Y + Z);
  let y = Y / (X + Y + Z);

  // Correction si les coordonnées sont en dehors de la gamme [0, 1]
  x = isNaN(x) ? 0.0 : x;
  y = isNaN(y) ? 0.0 : y;

  return { x, y };
}
function onUpdate(App) {
  console.log(App);
  if (App === "lights") {
    let XMLX = new XMLHttpRequest();
    XMLX.open(
      "GET",
      "http:" +
        window.location.origin.split(":")[1] +
        ":56127/?action=get_lights"
    );
    XMLX.responseType = "json";
    XMLX.onload = function () {
      const lightsData = XMLX.response;

      const lightsContainer = document.getElementById("lights-container");
      lightsContainer.innerHTML = "";
      for (const light_index in lightsData[0]) {
        if (Object.hasOwnProperty.call(lightsData[0], light_index)) {
          const lightInfo = lightsData[0][light_index];

          const lightCard = document.createElement("div");
          lightCard.classList.add("light-card");

          const title = document.createElement("h2");
          title.textContent = lightInfo.name;
          lightCard.appendChild(title);

          const stateInfo = document.createElement("p");
          stateInfo.innerHTML = `State: ${
            lightInfo.state.on ? "On" : "Off"
          } <button onclick="toggleState(this)" data-toggle="${
            lightInfo.state.on ? "on" : "off"
          }" data-light="${light_index}">Toggle</button>`;
          lightCard.appendChild(stateInfo);

          const brightnessInfo = document.createElement("p");
          brightnessInfo.textContent = `Brightness: ${lightInfo.state.bri}`;
          lightCard.appendChild(brightnessInfo);

          lightsContainer.appendChild(lightCard);
        }
      }
    };
    XMLX.send();
  }
  if (App === "Modify_State") {
    let XMLX = new XMLHttpRequest();
    XMLX.open(
      "GET",
      "http:" +
        window.location.origin.split(":")[1] +
        ":56127/?action=get_lights"
    );
    XMLX.responseType = "json";
    XMLX.onload = function () {
      const lightsData = XMLX.response;

      const lightsContainer = document.getElementById("lights-container2");
      lightsContainer.innerHTML = "";
      for (const light_index in lightsData[0]) {
        if (Object.hasOwnProperty.call(lightsData[0], light_index)) {
          const lightInfo = lightsData[0][light_index];
          const lightCard = document.createElement("div");
          lightCard.classList.add("light-card");

          const title = document.createElement("h2");
          title.textContent = lightInfo.name;
          lightCard.appendChild(title);
          const stateInfo = document.createElement("p");

          // Vérifiez le type de lampe
          if (lightInfo.type === "Color temperature light") {
            // Traitement spécifique pour les lampes "Color temperature light"
            const ctInfo = document.createElement("p");
            ctInfo.textContent = `Color Temperature: ${lightInfo.state.ct}`;
            lightCard.appendChild(ctInfo);
          } else {
            // Traitement commun pour les autres types de lampes
            const xybri = [
              lightInfo.state.xy[0],
              lightInfo.state.xy[1],
              lightInfo.state.bri,
            ];
            const hex = xyBriToHex(xybri[0], xybri[1], xybri[2]);
            stateInfo.innerHTML = `State: ${
              lightInfo.state.on ? "On" : "Off"
            } <button onclick="toggleState(this)" data-toggle="${
              lightInfo.state.on ? "on" : "off"
            }" data-light="${light_index}">Toggle</button><input value="${hex}" data-last="${hex}" type="color"></input><input type="range" data-last="${hex}" class="volume" min="0" value="${
              lightInfo.state.bri
            }" max="254" step="1" />`;
            lightCard.appendChild(stateInfo);

            const brightnessInfo = document.createElement("p");
            brightnessInfo.textContent = `Brightness: ${lightInfo.state.bri}`;
            lightCard.appendChild(brightnessInfo);
          }

          lightsContainer.appendChild(lightCard);

          stateInfo.querySelectorAll("input").forEach((inputs) => {
            setTimeout(() => {
              if (inputs.dataset["last"] !== inputs.value) {
                console.log(inputs.value);
              }
            }, 1000);
          });
        }
      }
    };
    XMLX.send();
    setTimeout(() => {
      IOSPage.update("Modify_State");
    }, 3000);
  }
}
const IOSPage = new WebUI("Hue App", onUpdate);
const WebUIPage1 = new WebUIPage("Lights");
const data = [
  {
    name: "Lights",
    html: `
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f0f0f0;
    }

    #lights-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 20px;
        height: 70vh;
        overflow: scroll;
    }
    button {
      background-color: rgba(51, 51, 51, 0.05);
      border-radius: 8px;
      border-width: 0;
      color: #333333;
      cursor: pointer;
      display: inline-block;
      font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      list-style: none;
      margin: 0;
      padding: 10px 12px;
      text-align: center;
      transition: all 200ms;
      vertical-align: baseline;
      white-space: nowrap;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }
    .light-card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin: 10px;
        padding: 20px;
        width: 300px;
    }

    h2 {
        margin-top: 0;
    }

    p {
        margin-bottom: 0;
    }
</style>
<div id="lights-container"></div>

    `,
  },
];
function toggleState(element) {
  let state = element.dataset["toggle"];
  if (state == "on") {
    state = "off";
    let XMLX = new XMLHttpRequest();
    XMLX.open(
      "GET",
      "http:" +
        window.location.origin.split(":")[1] +
        ":56127/?action=set_state_off&param=" +
        element.dataset["light"]
    );
    XMLX.responseType = "json";
    XMLX.onload = function () {
      IOSPage.update(WebUIPage1.name.toLowerCase());
    };
    XMLX.send();
  } else {
    state = "on";
    let XMLX = new XMLHttpRequest();
    XMLX.open(
      "GET",
      "http:" +
        window.location.origin.split(":")[1] +
        ":56127/?action=set_state_on&param=" +
        element.dataset["light"]
    );
    XMLX.responseType = "json";
    XMLX.onload = function () {
      IOSPage.update(WebUIPage1.name.toLowerCase());
    };
    XMLX.send();
  }
}
WebUIPage1.set_elements(data);
const WebUIPage2 = new WebUIPage("Modify_State");
const data_2 = [
  {
    name: "Modify_State",
    html: `
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f0f0f0;
    }

    #lights-container2 {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 20px;
        height: 70vh;
        overflow: scroll;
    }
    button {
      background-color: rgba(51, 51, 51, 0.05);
      border-radius: 8px;
      border-width: 0;
      color: #333333;
      cursor: pointer;
      display: inline-block;
      font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      list-style: none;
      margin: 0;
      padding: 10px 12px;
      text-align: center;
      transition: all 200ms;
      vertical-align: baseline;
      white-space: nowrap;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
    }
    .light-card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin: 10px;
        padding: 20px;
        width: 300px;
    }

    h2 {
        margin-top: 0;
    }

    p {
        margin-bottom: 0;
    }
</style>
<div id="lights-container2"></div>

    `,
  },
];
WebUIPage2.set_elements(data_2);
const WebUIPage3 = new WebUIPage("routinesAndSettings");
const data_3 = [
  {
    name: "routinesAndSettings",
    html: ``,
  },
];
WebUIPage3.set_elements(data_3);

const footer_data = [
  {
    name: "Lights",
    link: "Lights",
    svg: "https://icons.getbootstrap.com/assets/icons/house.svg",
  },
  {
    name: "Modify_State",
    link: "Modify_State",
    svg: "https://icons.getbootstrap.com/assets/icons/play-fill.svg",
  },
  {
    name: "routinesAndSettings",
    link: "routinesAndSettings",
    svg: "https://icons.getbootstrap.com/assets/icons/gear.svg",
  },
];
IOSPage.set_footer(footer_data, "rgb(240, 240, 240)");

IOSPage.append(WebUIPage1);
IOSPage.append(WebUIPage2);
IOSPage.append(WebUIPage3);
IOSPage.update(WebUIPage1.name.toLowerCase());
