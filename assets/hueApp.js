let timesOut = [];

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
function getXY(red, green, blue) {
  if (red > 0.04045) {
    red = Math.pow((red + 0.055) / (1.0 + 0.055), 2.4);
  } else red = red / 12.92;

  if (green > 0.04045) {
    green = Math.pow((green + 0.055) / (1.0 + 0.055), 2.4);
  } else green = green / 12.92;

  if (blue > 0.04045) {
    blue = Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4);
  } else blue = blue / 12.92;

  var X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
  var Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
  var Z = red * 0.000088 + green * 0.07231 + blue * 0.986039;
  var x = X / (X + Y + Z);
  var y = Y / (X + Y + Z);
  return new Array(x, y);
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function kelvinToRgb(kelvin) {
  const temperature = kelvin / 100;
  if (kelvin <= 0) {
    // Gérer ce cas particulier
    return [0, 0, 0];
  }

  let r, g, b;

  if (temperature <= 66) {
    r = 255;
    g = temperature;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;

    if (temperature <= 19) {
      b = 0;
    } else {
      b = temperature - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
    }
  } else {
    r = temperature - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);

    g = temperature - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);

    b = 255;
  }

  r = Math.round(clamp(r, 0, 255));
  g = Math.round(clamp(g, 0, 255));
  b = Math.round(clamp(b, 0, 255));

  return { r, g, b };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function ctToKelvin(ct) {
  return Math.round(1000000 / ct);
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
    timesOut.forEach((timeout) => {
      clearInterval(timeout);
    });
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
            ctInfo.innerHTML = `Color Temperature: ${
              lightInfo.state.ct
            } <br>Color Temperature <div class="color_show" style="width:100%;height:10px;background:rgba(${
              kelvinToRgb(ctToKelvin(lightInfo.state.ct)).r
            },${kelvinToRgb(ctToKelvin(lightInfo.state.ct)).g},${
              kelvinToRgb(ctToKelvin(lightInfo.state.ct)).b
            }, 0.6);"></div> <br> : <input type="range" data-last="${
              lightInfo.state.ct
            }" class="volume" min="154" value="${
              lightInfo.state.ct
            }" max="500" step="1" id="CT" /> <input style="display: none;" type="range" data-last="${
              lightInfo.state.ct
            }-2" class="volume" min="0" value="${
              lightInfo.state.ct
            }" max="453" step="1" id="BRIGHT" />`;
            lightCard.appendChild(ctInfo);
            ctInfo.querySelector("#CT").addEventListener("input", (e) => {
              ctInfo.querySelector(".color_show").style.background = `rgba(${
                kelvinToRgb(ctToKelvin(e.target.value - 153)).r
              },${kelvinToRgb(ctToKelvin(e.target.value - 153)).g},${
                kelvinToRgb(ctToKelvin(e.target.value - 153)).b
              }, 0.6)`;
              console.log(e.target.value);
            });
            ctInfo.querySelectorAll("input").forEach((inputs) => {
              timesOut.push(
                setInterval(() => {
                  if (inputs.dataset["last"] !== inputs.value) {
                    if (inputs.id == "CT") {
                      let XMLX_001 = new XMLHttpRequest();
                      XMLX_001.open(
                        "GET",
                        "http:" +
                          window.location.origin.split(":")[1] +
                          ":56127/?action=set_state&param=" +
                          light_index +
                          "&param2=" +
                          encodeURIComponent(
                            JSON.stringify({
                              bri: ctInfo.querySelectorAll("input")[1].value,
                              on: true,
                              ct: Number(inputs.value) - 153,
                            })
                          )
                      );
                      XMLX_001.responseType = "json";
                      XMLX_001.onload = function () {};
                      XMLX_001.send();
                      inputs.dataset["last"] = inputs.value;
                    } else {
                      let XMLX_001 = new XMLHttpRequest();
                      XMLX_001.open(
                        "GET",
                        "http:" +
                          window.location.origin.split(":")[1] +
                          ":56127/?action=set_state&param=" +
                          light_index +
                          "&param2=" +
                          encodeURIComponent(
                            JSON.stringify({
                              bri: inputs.value,
                              on: true,
                              ct: Number(
                                ctInfo.querySelectorAll("input")[0].value - 153
                              ),
                            })
                          )
                      );
                      XMLX_001.responseType = "json";
                      XMLX_001.onload = function () {};
                      XMLX_001.send();
                      inputs.dataset["last"] = inputs.value;
                    }
                  }
                }, 1000)
              );
            });
          } else {
            // Traitement commun pour les autres types de lampes
            const xybri = [
              lightInfo.state.xy[0],
              lightInfo.state.xy[1],
              lightInfo.state.bri,
            ];
            console.log(lightInfo.state);

            const hex = xyBriToHex(xybri[0], xybri[1], xybri[2]);
            stateInfo.innerHTML = `State: ${
              lightInfo.state.on ? "On" : "Off"
            }<input value="${hex}" data-last="${hex}" type="color"></input><input type="range" data-last="${
              lightInfo.state.bri
            }" class="volume" min="0" value="${
              lightInfo.state.bri
            }" max="254" step="1" />`;
            lightCard.appendChild(stateInfo);
            const brightnessInfo = document.createElement("p");
            brightnessInfo.textContent = `Brightness: ${lightInfo.state.bri}`;
            lightCard.appendChild(brightnessInfo);
            stateInfo.querySelectorAll("input").forEach((inputs) => {
              timesOut.push(
                setInterval(() => {
                  if (inputs.dataset["last"] !== inputs.value) {
                    if (inputs.type === "color") {
                      let XMLX_001 = new XMLHttpRequest();
                      XMLX_001.open(
                        "GET",
                        "http:" +
                          window.location.origin.split(":")[1] +
                          ":56127/?action=set_state&param=" +
                          light_index +
                          "&param2=" +
                          encodeURIComponent(
                            JSON.stringify({
                              on: true,
                              bri: stateInfo.querySelectorAll("input")[1].value,
                              xy: getXY(
                                hexToRgb(inputs.value).r,
                                hexToRgb(inputs.value).g,
                                hexToRgb(inputs.value).b
                              ),
                            })
                          )
                      );
                      XMLX_001.responseType = "json";
                      XMLX_001.onload = function () {};
                      XMLX_001.send();
                      inputs.dataset["last"] = inputs.value;
                    } else {
                      let XMLX_001 = new XMLHttpRequest();
                      XMLX_001.open(
                        "GET",
                        "http:" +
                          window.location.origin.split(":")[1] +
                          ":56127/?action=set_state&param=" +
                          light_index +
                          "&param2=" +
                          encodeURIComponent(
                            JSON.stringify({
                              on: true,
                              bri: Number(inputs.value),
                              xy: getXY(
                                hexToRgb(
                                  stateInfo.querySelectorAll("input")[0].value
                                ).r,
                                hexToRgb(
                                  stateInfo.querySelectorAll("input")[0].value
                                ).g,
                                hexToRgb(
                                  stateInfo.querySelectorAll("input")[0].value
                                ).b
                              ),
                            })
                          )
                      );
                      XMLX_001.responseType = "json";
                      XMLX_001.onload = function () {};
                      XMLX_001.send();
                      inputs.dataset["last"] = inputs.value;
                    }
                  }
                }, 1000)
              );
            });
          }

          lightsContainer.appendChild(lightCard);
        }
      }
    };
    XMLX.send();
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
