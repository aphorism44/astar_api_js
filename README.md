
This API was created to work with a JavaScript canvas library (enchant.js). Here's an amusing blog entry explaining the impetus behind its creation: http://www.aphorism44.com/blog/blogEntry.php?entryId=16 

Basically, this module is a simple implementation of the A* pathfinding algorithm, on the model of a 2-D Cartesian graph. If you feed in the start and end points, along with a 2D array representing the map, and optionally the "accessible spot" symbol (defaulted to "0"), it will feed back the path.

There are two public methods in this API:

1. AStar.getDirectionArray (map, startX, startY, goalX, goalY, OPTIONAL open DEFAULTED TO '0')

This returns an array of integers representing the precise actions the actor would take to move to the goal point. The actions follow this key: UP = 3, DOWN = 0, LEFT = 1, RIGHT = 2.

NOTE: In the enchant.js library, these were the corresponding numbers for the directions, and was the method used.

2. AStar.getPointArray (same parameters)

The returns an array of the actual points the actor moved through, including the start and end points. The points are in the string format "(x, y)"

I have not promoted this API for a number of reasons:

<ol>
<li>The enchant.js library has not been updated since September 2013, so for all intents and purposes it is outdated. I no longer make apps using it, and even one of my existing apps broke because of browser spec changes. However, the map format (2D array) was used specifically since that's how enchant.js stored its collision maps.</li>
<li>My implementation (a standard 2D RPG-type map the character moves through) was "centered." So, the (x,y) point the user clicks on is not the same as the map's (x,y). Within my program, I corrected for this, but it needs to be updated to automatically adjust given some extra parameters. It can also be updated to accept an array of possible "open" spots, even though that will slow down the calculations.</li>
<li>Finally, and most important, I switched to the phaser.io canvas library, and within weeks of my joining their mailing list, somebody actually implemented it! (http://rafarel-design.com/phaser/examples/_site/view_full.html?d=plugins&f=astar.js&t=astar). So, I'd have to update this to at least surpass that, but I haven't even had time to create games in phaser.io yet.</li>
</ol>

Despite that, this is a nontrivial API. I used my university text (Russell and Norvig's 3rd edition) as a guide to both the concept and general pseudocode. The heuristic function is a simple distance formula between two points.
