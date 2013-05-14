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

    service.getExperienceByCategory = function(category) {
        if (category === 'action') {
            return {
                'id'         : '2',
                'title'      : 'Madcap Hilarity',
                'views'      : 1000,
                'src'         : [
                                   {
                                    'type': 'video/webm',
                                    'src': baseUrl + '/media/bruce_lee.webm'
                                   },
                                   {
                                    'type': 'video/mp4',
                                    'src': baseUrl + '/media/bruce_lee.mp4'
                                   }
                                 ],
                'defSizeLimit': 32,
                'prompts'     : [
                    'Salutation',
                    'Animal',
                    'Superhero',
                    'Body Part (plural)',
                    'Plural noun',
                    'Animal Noise',
                    'Greek God',
                    'Character from Star Wars',
                    '80\'s female sitcom star',
                    'Type of candy'
                    ],
                'annotations' : {
                    'options' : {
                        'type'      : 'bubble',
                        'duration'  : 4,
                        'cls'     : ['lee-${index}']
                        },
                     'notes'  : [
                        { 'ts':  7,'template':'${1}', 'duration':1 },
                        { 'ts': 16,'template':'My dramatic entrance' },
                        { 'ts': 18,'template':'Must look tough' },
                        { 'ts': 20,'template':'Crazy ${2} stare', 'duration': 2 },
                        { 'ts': 22,'template':'${2} ${3}' },
                        { 'ts': 39,'template':'Get Out' },
                        { 'ts': 41,'template':'Or I will crush your ${4} into ${5}', 'duration':2 },
                        { 'ts': 52,'template':'${4}!!!' },
                        { 'ts': 62,'template':'${5}!!!' },
                        { 'ts': 78,'template':'${6}!!!', 'duration':2 },
                        { 'ts': 86,'template':'${6}???', 'duration':2 },
                        { 'ts': 95,'template':'No, handcuffs of ${7}!' },
                        { 'ts':100,'template':'Bruce Lee > ${7}!', 'duration':2 },
                        { 'ts':116,'template':'I\'m ${8}!', 'duration': 2 },
                        { 'ts':119,'template':'No, you\'re a dumb Ewok', 'duration': 1 },
                        { 'ts':120,'template':'Shut up stupid!', 'duration':2 },
                        { 'ts':123,'template':'Good comeback ${9}', 'duration':2 },
                        { 'ts':125,'template':'${10}', 'duration':2 },
                        { 'ts':128,'template':'That made no sense', 'duration':2 },
                        { 'ts':130,'template':'${6}?', 'duration':2 },
                        { 'ts':132,'template':'${2} ${3}!', 'duration':2 }
                    ]
                }
            };
        }
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
                'annotations' :  {
                    'options' : {
                        'type'       : 'bubble',
                        'duration'   : 4,
                        'cls'        : ['notebook-${index}']
                    },
                    'notes' : [
                       { 'ts':11,'template':'Weird, smells like ${1}!' },
                       { 'ts':16,'template':'Damn she knows I just ${2}.' },
                       { 'ts':19,'template':'Rain Diversion ${3}!' },
                       { 'ts':27,'template':'Casual laugh, think about a mutant ${4} ${5}.' },
                       { 'ts':34,'template':'${4} ${5}!!' },
                       { 'ts':39,'template':'Must counter or he\'ll think I\'m boring like ${6}.' },
                       { 'ts':43,'template':'Commence over-acting.  Channel ${7}.' },
                       { 'ts':54,'template':'umm WTF was that? She must ${8} ${9}.' },
                       { 'ts':58,'template':'I love ${9}.' }
                    ]
                }
            };
    };


    return service;
}]);

})();
