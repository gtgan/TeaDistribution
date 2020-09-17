TeaDistribution
===============

Distributed computing system


Authors
-------

[Gregory Gan](https://github.com/gtgan)  
[Ashwin Ramaswamy](https://github.com/arcpu-net786)  
[Karanbir Bains](https://github.com/ksbains)  


Basic Requirements
------------------

A successful distributed computing system must:

- Find and authenticate hosts for use
- Split tasks across hosts to (mostly) evenly distribute work
- Balance consistency, availability, and partition tolerance (CAP theorem)
- Recover gracefully from host and connection failures
- Provide a layer of abstraction hiding individual hosts from the application


Design Decisions
----------------

Language: Python 3
