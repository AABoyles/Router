Router
======

A (mostly) client-side Heuristic Route Planner

By Tony Boyles (AABoyles@gmail.com)

What is this?
-------------

This is a little Mapping application which generates heuristic solutions to
the Euclidean Traveling Salesman Problems (ETSP).

Back up a sec, what?
--------------------

The [Traveling Salesman Problem]
(http://en.wikipedia.org/wiki/Travelling_salesman_problem) is a famous problem
in Computational Theory.  It goes a little something like this:

> Imagine you're a traveling salesman.  You need to visit a bunch of cities to
> peddle your wares, and then return home.  What's the shortest way to do that?

Now, even though it's pretty easy to explain, it's really hard to solve. It
belongs to a group of problems called NP-hard, which basically means there's no
fast way to calculate the best possible solution.

Instead of the best solution, we can use clever rules to generate good routes
pretty quickly. These rules are called 'heuristics'.

What Heuristic Algorithms do you use?
-------------------------------------

This uses a Nearest-Neighbor approach, and it also has a Nearest-Edge Engine.

Tell me a little more about these!
----------------------------------

OK!

### Nearest Neighbor ###

[Nearest Neighbor] (http://en.wikipedia.org/wiki/Nearest_neighbour_algorithm) is
one of the best-known heuristics for the TSP.  It works like this:

1. Starting from Home, Go to the city closest to Home.
2. Mark that city as "visited" and go to the next closest city which hasn't been
marked as visited.
3. Repeat Step 2 until all of your cities are marked as visited.
4. Go home.

Unfortunately, this isn't a great approach.  That's why we have...

### Nearest Edge ###

Nearest Edge is a simple heuristic with exceptional performance for this
particular formulation of the TSP.  Here's what it does:

1. Starting from Home, draw a line to any city.
2. Pick another city, and for every line that's already on the map, calculate
how far you'd have to go to visit that city between the two endpoints of the
line--this is the insertion cost.
3. For the line with the lowest insertion cost, erase that line, and then draw
lines from one of your old endpoints to your new city, and from the city to the
other old endpoint.
4. Repeat Steps 2 and 3 until every city is visited.

This provides results similar to what a human might (though the means by which
those results are generated are very different). Most noticably, routes coming
from this algorithm tend not to have overlapping edges, which are always
inefficient in Euclidean planes.

OK, so theory aside, what is this thing?
----------------------------------------

A little webapp.  It uses OpenLayers for the mapping legwork, and OpenStreetMap
for the actual maps.  There's a bit of jQuery and jQueryUI for the pretty
buttons, and then my little Javascript to do the calculations.

You said "Mostly" Client-side...
--------------------------------

I love developing client-side applications. The amount that can be accomplished
inside a plugin-free standards-compliant browser is breathtaking. I think that
Web Applications Developers have clung to old Client-Server models of
interaction for too long! All the computation for this occurs in the browser,
not offloaded to some expensive server. This makes it super-cheap to deploy.
You can run it off Github Pages (or Dropbox, or any number of other file hosts)
for Free, or deploy it from Amazon S3 for pennies.

That said, Mapping applications don't exactly work with flat file architectures.
In this case, the "mostly" means that everything but the tiles happens in the
browser. We still need a map server to feed us the map. Luckily, OpenStreetMap
makes its tile servers freely available for mild usage.

Where are you going with this thing?
------------------------------------

Nowhere in particular. It just seemed pretty fun.

In the future, I might look into replacing OpenLayers with a simple world map
built by [D3.js](http://d3js.org/) and a minimal
[TopoJSON](https://github.com/mbostock/topojson) file.  But that's a long way
off--OpenLayers is deeply baked into this thing.

Alternately, I could double down on OpenLayers and work on a branch for the
upcoming [OpenLayers3](http://ol3js.org/) release.

License
-------

Copyright (c) 2014, Tony Boyles

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
