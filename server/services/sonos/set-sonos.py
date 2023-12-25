from genericpath import isfile
from http.server import BaseHTTPRequestHandler, HTTPServer
import platform
import requests
import random
from urllib.parse import urlparse, parse_qs
import json
from pytube import YouTube 
import os 
from youtubesearchpython import VideosSearch
from soco import SoCo
from pydub import AudioSegment

hostName = "0.0.0.0"
serverPort = 56126
class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
      self.send_response(200)
      parsed_url = urlparse(self.path)
      query_params = parse_qs(parsed_url.query)
      self.send_header("Access-Control-Allow-Origin", "*")
      if query_params.get("close") != None:
        self.send_header("Content-type", "text/html")
        self.end_headers()
        self.wfile.write(bytes('<script>window.close();</script>'.encode('utf-8')))
      elif query_params.get("action")[0] == "You2Mp3":
        self.send_header("Content-type", "audio/mp3")
        self.end_headers()
      else:
          self.send_header("Content-type", "application/json")
          self.end_headers()
      f = open("../../../etc/py/sonos/ip.rlbconf", "r")
      ipS = json.loads(f.read())
      f.close()

      parsed_url = urlparse(self.path)
      query_params = parse_qs(parsed_url.query)
      if query_params.get("action") != None:
          if query_params.get("action")[0] == "set_volume":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  zone.volume = query_params["param2"][0]
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "play_song":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  zone.play_uri(query_params["param2"][0])
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "get_state":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  self.wfile.write(('"'+str(zone.get_current_transport_info()["current_transport_state"])+'", ').encode('utf-8'))
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "play":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  zone.play()
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "pause":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  zone.pause()
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "YVS":
              videosSearch = VideosSearch(query_params["param"][0], limit=4)
              links = "Voici les résultats de la recherche : "
              # Parcourez les résultats de la recherche vidéo
              index = 0
              for result in videosSearch.result()["result"]:
                  if index == 0:
                      links = links + result["link"] + " (titre) : " + result["title"]
                  else:
                      links = links + " , et : " + result["link"] + " (titre) : " + result["title"]
                  index += 1
              # Convertissez le dictionnaire en format JSON et envoyez-le en réponse
              self.wfile.write((links).encode('utf-8'))
          if query_params.get("action")[0] == "You2Mp3":
              yt = YouTube(query_params.get("param")[0])
              video = yt.streams.filter(only_audio=True).first()
              out_file = video.download(output_path="../../../tmp/")
              new_file = 'YT_'+str(random.randint(1, 1000))+'.mp3'
              os.rename(out_file, "../../../tmp/"+new_file)

              with open("../../../tmp/"+new_file, "rb") as file:
                special_audio = AudioSegment.from_file("../../../tmp/"+new_file)
                mp3_audio = special_audio.export("../../../tmp/T_"+new_file, format="mp3")
                print("../../../tmp/"+new_file)
                with open("../../../tmp/T_"+new_file, "rb") as file2:
                    self.wfile.write(file2.read())
if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
