from genericpath import isfile
from http.server import BaseHTTPRequestHandler, HTTPServer
import platform
import requests
import json
import os
hostName = "0.0.0.0"
serverPort = 56123
class MyServer(BaseHTTPRequestHandler):
    def do_POST(self):
      self.send_response(200)
      self.send_header("Content-type", "application/json")
      self.send_header("Access-Control-Allow-Origin", "*")
      self.end_headers()
      ip = "..."
      self.wfile.write(bytes('{'.encode('utf-8')))
      if isfile("../../../etc/py/hue/ip.rlbconf"):
        self.wfile.write(bytes('"part": {"status": "info", "info": "IP is early entered"}, '.encode('utf-8')))
        f = open("../../../etc/py/hue/ip.rlbconf", "r")
        ip = f.read()
        f.close()
      else:
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        if post_data != "":
          post_data_array = post_data.decode('utf-8').split('=')
        if len(post_data_array) == 1:
          self.wfile.write(bytes('"part_2": {"status": "ask", "info": "Enter Bridge IP (ex: 192.168.2.24) : "}, '.encode("utf-8")))
          self.wfile.write(bytes('"success": false}'.encode('utf-8')))
          return
        ip = post_data_array[1]
        try:
            hue_bridge = requests.get("http://"+ip+"/debug/clip.html")
            if hue_bridge.status_code == 200:
              self.wfile.write(bytes('"part_3": {"status": "info", "info": "Hue IP is correct"}, '.encode("utf-8")))
            else:
              self.wfile.write(bytes('"part_4": {"status": "info", "info": "Hue IP is NOT CORRECT"}, '.encode('utf-8')))
              self.wfile.write(bytes('"success": false}'.encode('utf-8')))
              return
        except (requests.exceptions.ConnectionError) as e:
          self.wfile.write(bytes('"part_5": {"status": "error", "info": "Hue IP is NOT CORRECT, error: CannotFindHost (requests.exceptions.ConnectionError/requests.exceptions.InvalidURL)}"}, '.encode('utf-8')))
          self.wfile.write(bytes('"success": false}'.encode('utf-8')))
          return
        f = open("../../../etc/py/hue/ip.rlbconf", "w")
        f.write(ip)
        f.close()
      api_key = "..."
      hostname = platform.node()
      if isfile("../../../etc/py/hue/api_key.rlbconf"):
        f = open("../../../etc/py/hue/api_key.rlbconf", "r")
        api_key = f.read()
        f.close()
        self.wfile.write(bytes('"part_6": {"status": "info", "info": "API Key is early configured"}, '.encode('utf-8')))
      else:
        data = json.dumps({"devicetype":"RL_BRIDGE#"+hostname})
        api_key_request = requests.post("http://"+ip+"/api", data)
        result = api_key_request.json()
        if result[0].get("error") != None:
          if result[0]["error"]["type"] == 101:
            self.wfile.write(bytes('"part_7": {"status": "error", "info": "Press the button on the bridge and retry"}, '.encode('utf-8')))
            self.wfile.write(bytes('"success": false}'.encode('utf-8')))
            return
        else:
          self.wfile.write((' "part_7": {"status": "info", "info": "The API_KEY is : ' + str(result[0]["success"]["username"]) + '"}, ').encode('utf-8'))
          f = open("../../../etc/py/hue/api_key.rlbconf", "w")
          ip = f.write(str(result[0]["success"]["username"]))
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
