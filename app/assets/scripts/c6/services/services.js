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
                        'SciFi-Fantasy',
                        'Sports'
                    ]
        };
    };

    service.getExperienceByCategory = function(category) {
        if (category === 'action') {
            return {
                'id'         : '2',
                'title'      : 'Battle for Revenge',
                'views'      : 1000,
                'src'         : baseUrl + '/media/bruce_lee',
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
                        'cls'     : ['lee-${index}', 'annotation__action']
                        },
                     'notes'  : [
                        { 'ts':  7,'template':'${1}', 'duration':1 },
                        { 'ts': 16,'template':'My dramatic entrance' },
                        { 'ts': 18,'template':'Must look tough' },
                        { 'ts': 20,'template':'Crazy ${2} stare', 'duration': 2 },
                        { 'ts': 22,'template':'${2} ${3}' },
                        { 'ts': 39,'template':'Get Out' },
                        { 'ts': 41,'template':'Or I will crush your ${4} into ${5}', 'duration':2 },
                        { 'ts': 52,'template':'${4}!!!', 'duration':2 },
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
                        { 'ts':132,'template':'${2} ${3}!', 'duration':1 }
                    ]
                }
            };
        } else
        if (category === 'scifi-fantasy') {
            return {
                'id'         : '3',
                'title'      : 'Heartbreaking Romance',
                'views'      : 1000,
                'src'         : baseUrl + '/media/lotr',
                'defSizeLimit': 32,
                'prompts'     : [
                    'favorite past time (past tense)',
                    'romantic pet nickname',
                    'fruit',
                    'body part',
                    'verb',
                    'plural noun',
                    'synonym for feces',
                    'noun',
                    'place',
                    'baby animal'
                    ],
                'annotations' : {
                    'options' : {
                        'type'      : 'bubble',
                        'duration'  : 4,
                        'cls'     : ['lotr-${index}', 'annotation__scifi-fantasy']
                        },
                     'notes'  : [
                        { 'ts':  3,'template':'I\'ll always remember', 'duration': 5 },
                        { 'ts':  5,'template':'The times we ${1} together', 'duration' : 3 },
                        { 'ts':  9,'template':'${2}' },
                        { 'ts': 12,'template':'${3} ${4}' },
                        { 'ts': 23,'template':'Wonder if he knows I ${1} with everyone' },
                        { 'ts': 29,'template':'Yes, I know..', 'duration' : 3 },
                        { 'ts': 32,'template':'but I don\'t care', 'duration' : 3 },
                        { 'ts': 35,'template':'Because I ${5} ${6} with Gandalf' },
                        { 'ts': 41,'template':'${3} ${4}' },
                        { 'ts': 49,'template':'What a ${7} ${8}' },
                        { 'ts': 58,'template':'I\'m ready to go to ${9}!' },
                        { 'ts': 63,'template':'Get over here you tiny ${7}', 'duration' : 2 },
                        { 'ts': 68,'template':'I hope they have ${6} in ${9}', 'duration' : 2 },
                        { 'ts': 75,'template':'You sail, I\'m not doing ${7} on this trip' },
                        { 'ts': 78,'template':'Hope this ${10} can swim', 'duration' : 2 },
                        { 'ts': 82,'template':'${2}', 'duration' : 4 },
                        { 'ts': 83,'template':'${2}', 'duration' : 3 },
                        { 'ts': 84,'template':'${7} ${8}', 'duration' : 2 },
                        { 'ts': 95,'template':'I just took a ${7} in my pants', 'duration' : 8 }
                    ]
                }
            };
        }
        return  {
                'id'          : '1',
                'title'       : 'Something Special',
                'views'       : 993,
                'src'         : baseUrl + '/media/not_over',
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
                        'cls'        : ['notebook-${index}', 'annotation__romance']
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
