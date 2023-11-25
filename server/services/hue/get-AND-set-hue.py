from genericpath import isfile
from http.server import BaseHTTPRequestHandler, HTTPServer
import platform
import requests
from urllib.parse import urlparse, parse_qs
import json
from soco import SoCo

import os
hostName = "0.0.0.0"
serverPort = 56127
class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
      self.send_response(200)
      self.send_header("Content-type", "application/json")
      self.send_header("Access-Control-Allow-Origin", "*")
      self.end_headers()
      if isfile("../../../etc/py/hue/ip.rlbconf"):
        f = open("../../../etc/py/hue/ip.rlbconf", "r")
        ip = f.read()
        f.close()
      else:
          return
      if isfile("../../../etc/py/hue/api_key.rlbconf"):
        f = open("../../../etc/py/hue/api_key.rlbconf", "r")
        api_key = f.read()
        f.close()
      else:
          return
      parsed_url = urlparse(self.path)
      query_params = parse_qs(parsed_url.query)
      if query_params.get("action") != None:
          if query_params.get("action")[0] == "get_lights":
              self.wfile.write(bytes('['.encode('utf-8')))
              request = requests.get("http://"+ip+"/api/"+api_key+"/lights")
              self.wfile.write((json.dumps(request.json())).encode('utf-8'))
              self.wfile.write(bytes(', "success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "set_state_on":
              print("ON")
              self.wfile.write(bytes('['.encode('utf-8')))
              request = requests.put("http://"+ip+"/api/"+api_key+"/lights/"+query_params["param"][0]+"/state", data=json.dumps({"on": True}))
              self.wfile.write((json.dumps(request.json())).encode('utf-8'))
              self.wfile.write(bytes(', "success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "set_state_off":
              print("OFF")
              self.wfile.write(bytes('['.encode('utf-8')))
              request = requests.put("http://"+ip+"/api/"+api_key+"/lights/"+query_params["param"][0]+"/state", data=json.dumps({"on": False}))
              self.wfile.write((json.dumps(request.json())).encode('utf-8'))
              self.wfile.write(bytes(', "success"]'.encode('utf-8')))
          if query_params.get("action")[0] == "set_state":
              self.wfile.write(bytes('['.encode('utf-8')))
              request = requests.put("http://"+ip+"/api/"+api_key+"/lights/"+query_params["param"][0]+"/state", data=query_params["param2"][0])
              self.wfile.write((json.dumps(request.json())).encode('utf-8'))
              self.wfile.write(bytes(', "success"]'.encode('utf-8')))
if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
