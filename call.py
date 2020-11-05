import ipaddress
import queue
import sys
import threading


class Member(object):

  def __init__(self, uid, addr, port):
    self.uid = uid
    if isinstance(addr, str) or isinstance(addr, int):
      self.addr = ipaddress.ip_address(addr)
    else:
      self.addr = addr
    self.port = port


class Frame(object):

  def __init__(self, data, uid):
    self.data = data
    self.uid = uid


class Call(object):

  # if no password, anyone can join
  def __init__(self, host, pipe_in=queue.Queue(), pipe_out=queue.Queue(), \
               members={}, pwd=None):
    self.host_id = host.uid
    self.pipe_in = pipe_in
    self.pipe_out = pipe_out
    self.members = members
    members[self.host_id] = host
    self.pwd = pwd
    self.run = False

  def join(self, member, pwd):
    if self.pwd == None or self.pwd == pwd or member.uid in self.members:
      self.members[member.uid] = member

  def leave(self, member):
    if self.host_id == member.uid:
      # TODO select another host
      pass
    del self.members[member.uid]
    if not self.members:
      self.shutdown()

  def receive(self, frame):
    try:
      self.pipe_in.put(frame)
    except queue.Full:
      print(f'Pipe to {self.host.uid}\'s meeting full', file=sys.stderr)

  def __handle(self):
    while self.run:
      try:
        f = self.pipe_in.get(block=True, timeout=1)
      except queue.Empty:
        pass
      for m in self.members:
        if m.port and m.addr and m.uid != f.uid:
          try:
            self.pipe_out.put(Frame(f.data, m.addr, m.port))
          except queue.Full:
            print(f'Pipe to {m.uid} ({m.addr}, {m.port}) full', file=sys.stderr)
      self.pipe_in.task_done()

  def start(self):
    self.run = True
    threading.Thread(target=self.__handle).start()

  def stop(self):
    self.run = False
