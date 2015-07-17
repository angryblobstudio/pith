(function(window, angular){
    'use strict';

    angular.module('gallery', []).directive('ptGalleryItem', function() {
        return {
            scope: {
                'itemid': '=ptGalleryItem'
            },
            link: function($scope, element, attrs) {
                var scope = $scope.$parent,
                    containerScope = scope.$parent;

                scope.$expanded = false;
                scope.$showdetails = false;
                scope.$$element = element;

                scope.$expanded = containerScope.$expandedId == $scope.itemid;
                scope.$showdetails = containerScope.$showdetailsId == $scope.itemid;

                scope.$toggle = function() {
                    if(scope.$showdetails) {
                        containerScope.$expandedScope.$expanded = false;
                        containerScope.$expandedScope = null;
                        containerScope.$detailScope = null;
                        scope.$showdetails = false;
                    } else {
                        var switchExpand = true;
                        if(containerScope.$expandedScope) {
                            var prevEl = containerScope.$expandedScope.$$element;
                            switchExpand = (prevEl.offset().top != element.offset().top);
                            if(switchExpand) containerScope.$expandedScope.$expanded = false;
                        }
                        if(switchExpand) {
                            scope.$expanded = true;
                            containerScope.$expandedScope = scope;
                        }
                        if(containerScope.$detailScope) {
                            containerScope.$detailScope.$showdetails = false;
                        }
                        scope.$showdetails = true;
                        containerScope.$detailScope = scope;
                    }

                    if(scope.$showdetails) containerScope.$showdetailsId = $scope.itemid;
                    if(scope.$expanded) containerScope.$expandedId = $scope.itemid;
                };
            }
        };
    });

})(window, window.angular);