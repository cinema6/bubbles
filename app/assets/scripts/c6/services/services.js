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
                'defSizeLimit': 32,
                'prompts'   : [
                    'strong smell',
                    'bodily function',
                    { query : 'exuberant expression' },
                    'animal',
                    { query : 'animal', sizeLimit : 25},
                    'type of bread',
                    'famous A-list celebrity',
                    'Fight move',
                    'plural vegetable'
                ],
                'annotations' :  [
                                   { 'type':'bubble','ts':11,'dur':4,'plot':[ 0.20, 0.45],
                                      'template':'Weird, smells like ${1}!'
                                   },
                                   { 'type':'bubble','ts':16,'dur':4,'plot':[ 0.15, 0.25],
                                     'template':'Damn she knows I just ${2}.'
                                   },
                                   { 'type':'bubble','ts':19,'dur':4,'plot':[ 0.15, 0.25],
                                     'template':'Rain Diversion ${3}!'
                                   },
                                   { 'type':'bubble','ts':27,'dur':4,'plot':[ 0.20, 0.25],
                                     'template':'Casual laugh, think about a mutant ${4} ${5}.'
                                   },
                                   { 'type':'bubble','ts':34,'dur':4,'plot':[ 0.20, 0.25],
                                     'template':'${4} ${5}!!'
                                   },
                                   { 'type':'bubble','ts':39,'dur':4,'plot':[ 0.20, 0.35],
                                     'template':'Must counter or he\'ll think I\'m boring like ${6}.'
                                   },
                                   { 'type':'bubble','ts':43,'dur':4,'plot':[ 0.20, 0.35],
                                     'template':'Commence over-acting.  Channel ${7}.'
                                   },
                                   { 'type':'bubble','ts':54,'dur':4,'plot':[ 0.20, 0.35],
                                     'template':'umm WTF was that? She must ${8} ${9}.'
                                   },
                                   { 'type':'bubble','ts':58,'dur':4,'plot':[ 0.20, 0.40],
                                     'template':'I love ${9}.'
                                   },
                                ]
            } ;
    };

    service.getVideoList = function() {

    };

    return service;
}]);

})();
