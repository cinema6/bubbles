/*
 * Copyright © Cinema6 2013 All Rights Reserved. No part of this library
 * may be reproduced without Cinema6's express consent.
 *
 * Build Version: 356a197, Mon Nov 04 2013 14:56:55 GMT-0500 (EST)
 * Build Date: Mon Nov 04 2013 15:30:08 GMT-0500 (EST)
 */

(function(){
    'use strict';
    angular.module('c6.ui',[])
        .service('c6ui', [function() {
            this.array = {
                lastItem: function(array) {
                    return array[array.length - 1];
                }
            };
        }]);
}());
