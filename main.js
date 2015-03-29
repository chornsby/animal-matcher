var module = angular.module("animalMatcher", []);

module.controller("GameController", ["$scope", "$timeout", function ($scope, $timeout) {

    $scope.batchedTileRows = initTileRows();
    $scope.busy = false;
    $scope.selectedTile = null;

    $scope.clickTile = function (tile) {
        // Do nothing for matched tiles or if controller is busy
        if (tile.matched || $scope.busy) {
            return;
        }

        tile.flip();

        // If the same card has been clicked twice then deselect it and return
        if (tile == $scope.selectedTile) {
            $scope.selectedTile = null;
            return;
        }

        // If another card has already been selected then see if they match
        if ($scope.selectedTile !== null) {

            // If they match then mark them as matched
            if (tile.src === $scope.selectedTile.src) {
                tile.matched = true;
                $scope.selectedTile.matched = true;

            // Else show both cards faceUp for a moment then flip them back over
            } else {
                // Set the controller as busy since it must wait for $timeout to
                // complete
                $scope.busy = true;
                $timeout((function(tile1, tile2) {
                    return function() {
                        tile1.flip();
                        tile2.flip();
                        $scope.busy = false;
                    };
                })(tile, $scope.selectedTile), 750);
            }

            // Deselect the tiles
            $scope.selectedTile = null;

        // Else select it and return
        } else {
            $scope.selectedTile = tile;
        }
    };

    function initTileRows() {
        // Instantiate constants and array to return
        var batchedTileRows = [],
            batchWidth = 6,
            imageSources = shuffle([
            "img/giraffe.png",
            "img/hippo.png",
            "img/monkey.png",
            "img/panda.png",
            "img/parrot.png",
            "img/penguin.png",
            "img/pig.png",
            "img/rabbit.png",
            "img/snake.png",
            "img/giraffe.png",
            "img/hippo.png",
            "img/monkey.png",
            "img/panda.png",
            "img/parrot.png",
            "img/penguin.png",
            "img/pig.png",
            "img/rabbit.png",
            "img/snake.png"
        ]);

        // Iterate through the sources and build rows of tiles
        for (var i = 0, l = imageSources.length; i < l; i += batchWidth) {
            var row = [];
            for (var j = i; j < i + batchWidth; j++) {
                row.push(new Tile(imageSources[j]));
            }
            batchedTileRows.push(row);
        }
        return batchedTileRows;
    }

}]);

module.directive("navBar", function() {
    return {
        restrict: "E",
        templateUrl: "templates/navbar.html"
    };
});

module.directive("tile", function() {
    return {
        restrict: "E",
        templateUrl: "templates/tile.html"
    }
});

module.directive("credits", function() {
    return {
        restrict: "E",
        templateUrl: "templates/credits.html"
    }
});

function Tile(src) {
    this.src = src;
    this.faceUp = false;
    this.matched = false;
}

Tile.prototype.flip = function() {
    this.faceUp = !this.faceUp;
};

function shuffle(arrayIn) {
    var counter = arrayIn.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = arrayIn[counter];
        arrayIn[counter] = arrayIn[index];
        arrayIn[index] = temp;
    }

    return arrayIn;
}