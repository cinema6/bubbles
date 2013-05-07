(function(){

'use strict';

angular.module('c6.svc',[])
.factory('c6VideoListingService',['$log','appBaseUrl',function($log,baseUrl){
    $log.log('Creating c6VideoListingService');
    var service          = {};

    service.getCategories = function() {
        return { 'categories' : [
                        'Action',
                        'Politics',
                        'Romance',
                        'Sports'
                    ]
        };
    };

    service.getExperienceByCategory = function(/*category*/) {
        return  {
                'id'          : '1',
                'title'       : 'Something Special',
                'views'       : 993,
                'src'         : [
                                   {
                                    'type': 'video/webm',
                                    'src': baseUrl + '/media/not_over.webm'
                                   },
                                   {
                                    'type': 'video/mp4',
                                    'src': baseUrl + '/media/not_over.mp4'
                                   }
                                 ],
                'questions'   : [
                    'Name a vegetable.',
                    'What is your favorite ice-cream.',
                    'Name a color.',
                    'An animal you would find at a zoo.',
                    'A country in Europe.',
                    'A popular song.',
                    'A small person.'
                ],
                'annotations' :  [
                                   { 'type' : 'b', 'ts' : 1,  'dur': 5, 'plot': [ 0.10, 0.05],
                                      'template' : 'This one is a real ${1}!'
                                   },
                                   { 'type' : 'b', 'ts' : 15, 'dur': 5, 'plot': [ 0.10, 0.05],
                                     'template' : 'He really likes ${2} and ${3}.'
                                   },
                                   { 'type' : 'b', 'ts' : 20, 'dur': 5, 'plot': [ 0.10, 0.05],
                                     'template' : 'What a ${4} really a ${5}.'
                                   },
                                   { 'type' : 'b', 'ts' : 25, 'dur': 5, 'plot': [ 0.10, 0.05],
                                     'template' : 'I need a ${6} and ${7}.'
                                   }
                                ]
            } ;
    };

    service.getVideoList = function() {

    };

    return service;
}]);

})();
