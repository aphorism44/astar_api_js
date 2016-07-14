(function(window){
    'use strict';
    function define_astar_api() {
        var AStar = {};
        var name = "AStar";
        
        /*
        AStar.getDirectionArray, AStar.getPointArray
        
        REQUIRES: ECMAScript 6 compliance
        
        PARAMETERS: 
        - map: 2D JS array; by default, 0 shows a point that isn't blocked (blocked symbol doesn't matter); represents a Cartesian graph of squares, with 0,0 in the upper left-hand corner
        - startX, startY: coordinates of actor's start location, using map
        - goalX, goalY: coordinates of actor's end location, using map
        OPTIONAL PARAMETERS:
        - open: replace the default open symbol with a customized one
        
        RETURNS:
        - an array; depending on the function, with n = number of squares used, this will either be:
            A. a series of (n-1) moves that would move the act/or from start to goal, using the following values: UP = 3, DOWN = 0, LEFT = 1, RIGHT = 2
            B. a series of n squares showing all points the actor traveled through, from start to goal
        */
        
        AStar.getDirectionArray = function(map, startX, startY, goalX, goalY, open = '0') {
            var problem = new createProblem(startX, startY, goalX, goalY, map);
            var winningPath = createAStarPath(problem, 1, open);
            return winningPath;
        }
        
        AStar.getPointArray = function(map, startX, startY, goalX, goalY, open = '0') {
            var problem = new createProblem(startX, startY, goalX, goalY, map);
            var winningPath = createAStarPath(problem, 2, open);
            return winningPath;
        }

        var createProblem = function(startX, startY, goalX, goalY, map) {
            this.blockMap = map;
            this.goalX = goalX;
            this.goalY = goalY;
            this.startX = startX;
            this.startY = startY;
            if (map.length > 0) {
                this.maxX = map[0].length - 1;
                this.maxY = map.length - 1;
            } else {
                this.maxX = 0;
                this.maxY = 0;
            } 
          }

        //PARAMETER type: 1 for directions, 2 for points
         var createAStarPath = function(problem, type, open) {
              var count = 0;
              var node = new createFirstNode(problem);
              var frontier = [];
              var availActions = [];
              frontier.push(node);
              var explored = [];
              while (true) { 
                  count++;
                  if (frontier.length === 0)
                        return []; 
                  //find the frontier node with smallest totalCost
                  var currTotal = 0, smallestTotal = 9999999, smallestLoc = 0;
                  for (var m = 0; m < frontier.length; m++) {
                      currTotal = frontier[m].totalCost;
                      if (currTotal < smallestTotal) {
                          smallestTotal = currTotal;
                          smallestLoc = m;
                      }
                  }
                  node = frontier.splice(smallestLoc, 1)[0];
                  if ( (problem.goalX  === node.stateX) && (problem.goalY === node.stateY) ) {
                      if (type === 1)
                          return getDirections(node);
                      else if (type === 2)
                          return getPoints(node);
                      else
                          return [];
                  }
                      
                  explored.push(node);
                  availActions = new getAvailableActions(node, problem, open);
                  for (var i = 0; i < availActions.length; i++) {
                      var childNode = new createChildNode(problem, node, availActions[i]);
                      var inFrontier = false;
                      var inExplored = false;
                      var matchedFrontierNode;
                      var matchedFrontierNodeLoc;
                      for (var j = 0; j < frontier.length; j++) {
                          var frontierNode = frontier[j];
                          if (childNode.identifier === frontierNode.identifier) {
                              inFrontier = true;
                              matchedFrontierNode = frontierNode;
                              matchedFrontierNodeLoc = j;
                              break;
                          }
                      } //end frontier search
                      for (var k = 0; k < explored.length; k++) {
                          var exploredNode = explored[k];
                          if (exploredNode.identifier === childNode.identifier) {
                              inExplored = true;
                              break;
                          }
                      } //end explored search
                      if (!inFrontier && !inExplored) {
                          frontier.push(childNode);
                      } else if (inFrontier && (childNode.totalCost <  matchedFrontierNode.totalCost) ) {
                         frontier[matchedFrontierNodeLoc] = childNode;
                      } 
                  } //end actions loop 
            } //end dowhile loop  
          }

          var createFirstNode = function(problem) {
              this.stateX = problem.startX;
              this.stateY = problem.startY;
              this.parent = null;
              this.creationAction = null;
              this.currCost = 0;
              this.estCost = getEstDistance(problem.startX, problem.startY, problem.goalX, problem.goalY);
              this.totalCost = this.currCost + this.estCost;
              this.identifier = this.stateX + "," + this.stateY;
          }

          var createChildNode = function(problem, parentNode, action) {
              this.parent = parentNode;
              this.creationAction = action;
              this.stateX = getStateX(parentNode.stateX, action);
              this.stateY = getStateY(parentNode.stateY, action);
              this.currCost = parentNode.currCost + 1;
              this.estCost = getEstDistance(this.stateX, this.stateY, problem.goalX, problem.goalY);
              this.totalCost = this.currCost + this.estCost;
              this.identifier = this.stateX + "," + this.stateY;
          }
          
          var getAvailableActions = function(node, problem, open) {
              var actionsAvail = [];
              //console.log(node.stateY);
              //console.log(node.stateX);
              //console.log(problem.maxX);
              //console.log(problem.maxY);
              //down
              if (node.stateY < problem.maxY) {
                if (String(problem.blockMap[node.stateY + 1][node.stateX]) === String(open)) {
                    actionsAvail.push(0);
                    }
                }
              //left
              if (node.stateX > 0) {
                if (String(problem.blockMap[node.stateY][node.stateX - 1]) === String(open)) {
                    actionsAvail.push(1);
                    }
                }
              //right
              if (node.stateX < problem.maxX) {
                if (String(problem.blockMap[node.stateY][node.stateX + 1]) === String(open)) {
                    actionsAvail.push(2);
                    }
                }
              //up
              if (node.stateY > 0) {
                if (String(problem.blockMap[node.stateY - 1][node.stateX]) === String(open)) {
                    actionsAvail.push(3);
                    }
                }
              return actionsAvail;
          }

          var getStateX = function(x, action) {
              switch(action) {
                  case 1: x--;
                        break;
                  case 2: x++;
                        break;
              }
              return x;
          }

          var getStateY = function(y, action) {
              switch(action) {
                  case 0: y++;
                        break;
                  case 3: y--;
                        break;
              }
              return y;
          }

        var getEstDistance = function(currX, currY, goalX, goalY) {
            return Math.sqrt( ( (goalX - currX) * (goalX - currX) ) + ( (goalY - (currY)) * (goalY - (currY)) ) );
        }

        var getDirections = function(winningNode) {
            var actions = [];
            var node = winningNode;
            actions.push(winningNode.creationAction);
            while (winningNode.parent) {
                node = node.parent;
                if (node.parent === null)
                    return actions;
                else
                    actions.unshift(node.creationAction);
            }
            return [];
        }
        
        var getPoints = function(winningNode) {
            var points = [];
            var node = winningNode;
            points.push(winningNode.identifier);
            while (winningNode.parent) {
                node = node.parent;
                points.unshift(node.identifier);
                if (node.parent === null)
                    return points;
            }
            return [];
        }

        
        return AStar;
    }
    //define globally if it doesn't already exist
    if(typeof(AStar) === 'undefined'){
        window.AStar = define_astar_api();
    }
    else{
        console.log("AStar already defined.");
    }
})(window);

