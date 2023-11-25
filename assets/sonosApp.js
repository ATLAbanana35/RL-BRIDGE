function onUpdate(App) {
  if (App === "settings") {
    let XMLX = new XMLHttpRequest();
    document.querySelector("#pet-select").innerHTML =
      '<option value="">--Please choose an option--</option>';
    XMLX.open(
      "GET",
      "http:" + window.location.origin.split(":")[1] + ":56125/?action=get_ips"
    );
    XMLX.responseType = "json";
    XMLX.onload = function () {
      XMLX.response.forEach((element) => {
        if (element !== "success") {
          let XMLX = new XMLHttpRequest();

          XMLX.open(
            "GET",
            "http:" +
              window.location.origin.split(":")[1] +
              ":56125/?action=get_name&param=" +
              element
          );
          XMLX.responseType = "json";
          XMLX.onload = function () {
            document.querySelector("#pet-select").innerHTML += `
                  <option class="0" value="${element}">${XMLX.response[0]}</option>
                    `;
          };
          XMLX.send();
        }
      });
    };
    XMLX.send();
    document.querySelector("select").addEventListener("input", () => {
      localStorage.setItem(
        "current_speaker",
        document.querySelector("select").value
      );
      document.querySelector(".chooser").innerHTML = `
      Your current speaker has been successfully updated!
      `;
    });
  }
  if (App === "home") {
    setInterval(() => {
      if (
        document.querySelector(".volume").dataset["last"] !=
        document.querySelector(".volume").value
      ) {
        document.querySelector(".volume").dataset["last"] =
          document.querySelector(".volume").value;
        let XMLX_2 = new XMLHttpRequest();
        XMLX_2.open(
          "GET",
          "http://192.168.1.140:56126/?action=set_volume&param=" +
            localStorage.getItem("current_speaker") +
            "&param2=" +
            document.querySelector(".volume").value
        );
        XMLX_2.onload = function () {
          if (XMLX_2.responseText == "[") {
            alert("Aucune musique en cours de lecture!");
          }
        };
        XMLX_2.send();
      }
    }, 1000);
    let XMLX = new XMLHttpRequest();
    XMLX.open(
      "GET",
      "http:" +
        window.location.origin.split(":")[1] +
        ":56125/?action=get_volume&param=" +
        localStorage.getItem("current_speaker")
    );
    XMLX.responseType = "json";
    XMLX.onload = function () {
      document.querySelector(".volume").value = XMLX.response[0];
      document.querySelector(".volume").dataset["last"] = XMLX.response[0];
    };
    XMLX.send();
    let XMLX_2 = new XMLHttpRequest();
    XMLX_2.open(
      "GET",
      "http:" +
        window.location.origin.split(":")[1] +
        ":56125/?action=get_state&param=" +
        localStorage.getItem("current_speaker")
    );
    XMLX_2.responseType = "json";
    XMLX_2.onload = function () {
      if (
        XMLX_2.response[0] === "STOPPED" ||
        XMLX_2.response[0] === "PAUSED_PLAYBACK"
      ) {
        document.querySelector(".play-pause img").src =
          "https://icons.getbootstrap.com/assets/icons/play-fill.svg";
      } else {
        document.querySelector(".play-pause img").src =
          "https://icons.getbootstrap.com/assets/icons/pause.svg";
      }
    };
    XMLX_2.send();
    document.querySelector(".play-pause").addEventListener("click", () => {
      let XMLX_3 = new XMLHttpRequest();
      XMLX_3.open(
        "GET",
        "http:" +
          window.location.origin.split(":")[1] +
          ":56125/?action=get_state&param=" +
          localStorage.getItem("current_speaker")
      );
      XMLX_3.responseType = "json";
      XMLX_3.onload = function () {
        if (
          XMLX_2.response[0] === "STOPPED" ||
          XMLX_2.response[0] === "PAUSED_PLAYBACK"
        ) {
          let XMLX_2 = new XMLHttpRequest();
          XMLX_2.open(
            "GET",
            "http://192.168.1.140:56126/?action=play&param=" +
              localStorage.getItem("current_speaker")
          );
          XMLX_2.onload = function () {
            if (XMLX_2.responseText == "[") {
              alert("Aucune musique en cours de lecture!");
            } else {
              document.querySelector(".play-pause img").src =
                "https://icons.getbootstrap.com/assets/icons/pause.svg";
              location.reload();
            }
          };
          XMLX_2.send();
        } else {
          let XMLX_2 = new XMLHttpRequest();
          XMLX_2.open(
            "GET",
            "http://192.168.1.140:56126/?action=pause&param=" +
              localStorage.getItem("current_speaker")
          );
          XMLX_2.onload = function () {
            if (XMLX_2.responseText == "[") {
              alert("Aucune musique en cours de lecture!");
            } else {
              document.querySelector(".play-pause img").src =
                "https://icons.getbootstrap.com/assets/icons/play-fill.svg";
              location.reload();
            }
          };
          XMLX_2.send();
        }
      };
      XMLX_3.send();
    });
  }
}
const IOSPage = new WebUI("Sonos App", onUpdate);
const WebUIPage1 = new WebUIPage("Home");
const data = [
  {
    name: "Player",
    html: `
    <div class="music-player">
    <div class="cover"></div>
    <div class="controls">
      <button class="play-pause">
        <img
          src="https://icons.getbootstrap.com/assets/icons/play-fill.svg"
          alt="play"
        />
      </button>
      <input type="range" data-last="0" class="volume" min="0" max="100" step="1" />
    </div>
  </div>
  <style>

    .music-player {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }

    .cover {
      background: url("assets/music.png");
      background-size: cover;
      width: 200px;
      height: 200px;
      background-color: #ccc;
      border-radius: 50%;
      margin-bottom: 20px;
    }

    .controls {
      display: flex;
      align-items: center;
    }

    .play-pause {
      width: 40px;
      height: 40px;
      background-color: #3498db;
      border: none;
      border-radius: 50%;
      margin-right: 10px;
      cursor: pointer;
    }

    .volume {
      width: 100px;
    }
  </style>    `,
  },
];
WebUIPage1.set_elements(data);
const WebUIPage2 = new WebUIPage("Play");
const data_2 = [
  {
    name: "Player_Personalized",
    html: `
    <div class="music-input">
    <label for="musicUrl">Please enter the url of the MP3 file :</label>
    <input type="text" id="musicUrl" placeholder="Enter URL here...">
    <button onclick="playMusic()">Play music</button>
  </div>
    <div class="youtube-input">
    <label for="youtubeUrl">Please enter the url of the YouTube video :</label>
    <input type="text" id="youtubeUrl" placeholder="Enter URL here...">
    <button onclick="playYouTubeMusic()">Download music (you can upload it to a drive)</button>
  </div>


  <style>

  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    margin: 0;
    background-color: #f0f0f0;
  }
  
  .music-input {
    text-align: center;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
  }
  
  input {
    width: 300px;
    padding: 5px;
    margin-bottom: 10px;
  }
  
  button {
    padding: 10px;
    background-color: #3498db;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  
  </style>    `,
  },
];
WebUIPage2.set_elements(data_2);
const WebUIPage3 = new WebUIPage("Settings");
const data_3 = [
  {
    name: "Settings",
    html: `
    <div class="settings">
    <div class="chooser">
    <label for="pet-select">Choose a speaker:</label>

    <select name="pets" id="pet-select">
      <option value="">--Please choose an option--</option>
      </select>
      </div>
    <!-- https://codepen.io/masonconkright/pen/aJOoVO -->
    <p class="link10">You change your system/location or the app don't work?  <a href="./sonos.html">Update your speakers</a></p>
  </div>  <style>

    .settings {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    .link10 a {
      position:relative;
      text-decoration: none;
      color: gray;
       transition:color .15s ease-in-out;
    }
    
    .link10 a:hover {
      background-size: 100% 100%;
      cursor: pointer;
    }
    
    .link10 a:after {
      display:block;
      content:"";
      position: absolute;
       right:0;
       left:0;
       width:100%;
      height:3px;
       opacity:0;
      transform:translateY(-150%);
       transition:transform .15s ease-in-out, opacity .15s ease-in-out;
       background-color: red;
    }
    
    .link10 a.is-active,
    .link10 a:active,
    .link10 a:focus,
    .link10 a:hover {
       color: red;
    }
    
    .link10 a.is-active:after,
    .link10 a:active:after,
    .link10 a:focus:after,
    .link10 a:hover:after {
       transform:translateY(0);
       opacity:1;
    }
  </style>    `,
  },
];
WebUIPage3.set_elements(data_3);

const footer_data = [
  {
    name: "home",
    link: "Home",
    svg: "https://icons.getbootstrap.com/assets/icons/house.svg",
  },
  {
    name: "play",
    link: "Play",
    svg: "https://icons.getbootstrap.com/assets/icons/play-fill.svg",
  },
  {
    name: "settings",
    link: "Settings",
    svg: "https://icons.getbootstrap.com/assets/icons/gear.svg",
  },
];
IOSPage.set_footer(footer_data, "rgb(240, 240, 240)");
function playMusic() {
  let url = document.querySelector("#musicUrl").value;
  let XMLX_2 = new XMLHttpRequest();
  XMLX_2.open(
    "GET",
    "http://192.168.1.140:56126/?action=play_song&param=" +
      localStorage.getItem("current_speaker") +
      "&param2=" +
      url
  );
  XMLX_2.onload = function () {};
  XMLX_2.send();
}
function playYouTubeMusic() {
  let url = document.querySelector("#youtubeUrl").value;
  let XMLX_2 = new XMLHttpRequest();
  XMLX_2.open(
    "GET",
    "http://192.168.1.140:56126/?action=You2Mp3&param=" +
      encodeURIComponent(url)
  );
  XMLX_2.responseType = "json";
  XMLX_2.onload = function () {
    console.log(XMLX_2.response);
    if (XMLX_2.response[0] != undefined) {
      function downloadFile(filePath) {
        var link = document.createElement("a");
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf("/") + 1);
        link.click();
      }
      downloadFile(XMLX_2.response[0]);
    }
  };
  XMLX_2.send();
}
IOSPage.append(WebUIPage1);
IOSPage.append(WebUIPage2);
IOSPage.append(WebUIPage3);
if (localStorage.getItem("current_speaker") == null) {
  alert("Please choose a speaker in settings before do something");
  IOSPage.update(WebUIPage3.name.toLowerCase());
} else {
  IOSPage.update(WebUIPage1.name.toLowerCase());
}
