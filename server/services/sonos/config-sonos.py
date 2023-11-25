from genericpath import isfile
from http.server import BaseHTTPRequestHandler, HTTPServer
import platform
import requests
import json
from soco import SoCo
from soco import discover
import os
hostName = "0.0.0.0"
serverPort = 56124
class MyServer(BaseHTTPRequestHandler):
    def do_POST(self):
      self.send_response(200)
      self.send_header("Content-type", "application/json")
      self.send_header("Access-Control-Allow-Origin", "*")
      self.end_headers()
      self.wfile.write(bytes('{'.encode('utf-8')))
      zones = []
      for zone in discover():
          self.wfile.write(('"part_'+str(zone.ip_address)+'": {"status": "info", "info": "IP_1 is : '+str(zone.ip_address)+'"}, ').encode('utf-8'))
          zones.append(zone.ip_address)
      f = open("../../../etc/py/sonos/ip.rlbconf", "w")
      f.write(json.dumps(zones))
      f.close()
      self.wfile.write(bytes('"success": true}'.encode('utf-8')))
if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
