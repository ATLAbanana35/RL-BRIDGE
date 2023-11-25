from genericpath import isfile
from http.server import BaseHTTPRequestHandler, HTTPServer
import platform
import requests
from urllib.parse import urlparse, parse_qs
import json
from soco import SoCo

import os
hostName = "0.0.0.0"
serverPort = 56125
class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
      self.send_response(200)
      self.send_header("Content-type", "application/json")
      self.send_header("Access-Control-Allow-Origin", "*")
      self.end_headers()
      f = open("../../../etc/py/sonos/ip.rlbconf", "r")
      ipS = json.loads(f.read())
      f.close()
      parsed_url = urlparse(self.path)
      query_params = parse_qs(parsed_url.query)
      if query_params.get("action") != None:
          if query_params.get("action")[0] == "get_ips":
              self.wfile.write(bytes('['.encode('utf-8')))
              for element in ipS:
                  self.wfile.write(('"'+element+'", ').encode('utf-8'))
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
              return
          if query_params.get("action")[0] == "get_volume":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  self.wfile.write(('"'+str(zone.volume)+'", ').encode('utf-8'))
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "get_name":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  self.wfile.write(('"'+str(zone.player_name)+'", ').encode('utf-8'))
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "get_playlists":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  for sonos_playlist in zone.get_sonos_playlists():
                      self.wfile.write(('"'+str(sonos_playlist.title)+'", ').encode('utf-8'))
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "get_state":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  self.wfile.write(('"'+str(zone.get_current_transport_info()["current_transport_state"])+'", ').encode('utf-8'))
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "get_track":
              self.wfile.write(bytes('['.encode('utf-8')))
              if query_params["param"][0] in ipS:
                  zone = SoCo(str(ipS[ipS.index(query_params["param"][0])]))
                  self.wfile.write(('"'+json.dumps(zone.get_current_track_info())+'", ').encode('utf-8'))
              self.wfile.write(bytes('"success"]'.encode('utf-8')))
if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
