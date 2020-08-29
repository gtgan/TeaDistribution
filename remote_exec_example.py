# This is a simple, insecure, and generally unsafe demonstration of a host that
# allows remote code execution.  Once a TCP connection is established, it
# accepts a null-terminated string, interprets the first token as a command and
# the rest as arguments, and returns a status code followed by the result of
# executing that command on those arguments.  Multiple connections are handled
# in separate processes.

import multiprocessing as mp
import socket
import time

from ipaddress import ip_address


# These are the functions that the host may execute at the remote's request
funcs = {
    "echo" : lambda a : a,
    "reverse" : lambda a : a[::-1]
}


def execute(str=""):
    try:
        str, rest = str.split(" ", 1)
    except ValueError:
        rest = ""
    try:
        return "0 {}".format(funcs[str](rest))
    except KeyError:
        return "-2 Invalid command: {}".format(str)
    except Exception as e:
        err = e.message if hasattr(e, 'message') else repr(e)
        return "-1 Execution failed\n{}".format(err)

def clean_conns(conns, check_alive=False):
    to_close = {}
    for k in conns:
        if check_alive and not conns[k].is_alive():
            to_close[k] = conns[k]
    for k in to_close:
        del conns[k]
        to_close[k].join()

def handler(conn, addr, run):
    with conn:
        while run.value:
            msg = ""
            while True:
                try:
                    buf = conn.recv(1024)
                except ConnectionResetError:
                    return
                if buf:
                    msg += buf.decode("utf-8")
                    if msg[-1] == '\0':
                        break
                else:
                    break
            if len(msg) > 0:
                result = execute(msg[:-1])
                conn.sendall("{}\0".format(result).encode("utf-8"))

def listener(host, port, timeout, conns, run):
    with socket.socket(
        socket.AF_INET if ip_address(host).version == 4 else socket.AF_INET6,
        socket.SOCK_STREAM
    ) as sock:
        sock.bind((host, port))
        sock.settimeout(timeout)
        while run.value:
            clean_conns(conns, True)
            try:
                sock.listen()
                conn, addr = sock.accept()
            except:
                continue
            proc = mp.Process(target=handler, args=(conn, addr, run))
            proc.start()
            conns[(conn, addr)] = proc
    clean_conns(conns)


class Host(object):
    """Simple host to demonstrate multiprocessed server"""

    def __init__(self, host="", port=8080, timeout=1):
        self.run = mp.Value("b", False)
        self.conns = {} # Beware lack of concurrency control
        self.host = host
        self.port = port
        self.timeout = timeout

    def listen(self):
        if self.run.value:
            print("Already running")
            return False
        print("Starting listener")
        self.run.value = True
        self.server = mp.Process(target=listener, args=self.server_info())
        self.server.start()
        return True

    def close(self):
        if self.run.value:
            print("Closing listener")
            self.run.value = False
            self.server.join()
            return True
        print("Not running")
        return False

    def server_info(self):
        return (self.host, self.port, self.timeout, self.conns, self.run)


# Test run
if __name__ == "__main__":
    HOST = "127.0.0.1"
    PORT = 8080
    h = Host(HOST, PORT)
    h.listen()
    time.sleep(0.1)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((HOST, PORT))
        for cmd in ["echo", "reverse"]:
            msg = "{} Hello World!\0".format(cmd).encode("utf-8")
            sock.sendall(msg)
            data = sock.recv(1024)
            print("{} -> {}".format(repr(msg), repr(data)))
    h.close()
