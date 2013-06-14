(function(){

'use strict';

angular.module('c6.svc',[])
.factory('c6VideoListingService',['$log','appBaseUrl',function($log,baseUrl){
    $log.log('Creating c6VideoListingService');
    var service          = {};

    service.getCategories = function() {
        return { 'categories' : [
                        'Action',
                        'Romance',
                        'SciFi-Fantasy',
                    ]
        };
    };

    service.getExperienceByCategory = function(category) {
        if (category === 'action') {
            return {
                'id'          : '2',
                'title'       : 'Battle for Revenge',
                'views'       : 1000,
                'src'         : baseUrl + '/media/action/bruce_lee',
                'css'         : baseUrl + '/styles/bubbles_action.css',
                'anim'        : 'action',
                'defSizeLimit': 18,
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
                        'cls'     : ['lee-${index}', 'annotation']
                        },
                     'notes'  : [
                        { 'ts':  7,'template':'${1}', 'duration':1.5 },
                        { 'ts': 16,'template':'My dramatic entrance' },
                        { 'ts': 18,'template':'Must look tough' },
                        { 'ts': 20,'template':'Crazy ${2} stare', 'duration': 2 },
                        { 'ts': 22,'template':'${2} ${3}' },
                        { 'ts': 39,'template':'Get Out' },
                        { 'ts': 41,'template':'Or I will crush your ${4} into ${5}', 'duration':2 },
                        { 'ts': 52,'template':'${4}!!!', 'duration':1.5 },
                        { 'ts': 61.5,'template':'${5}!!!', 'duration':2 },
                        { 'ts': 80.5, 'template':'${6}!!!', 'duration':2 },
                        { 'ts': 86,'template':'${6}???', 'duration':2 },
                        { 'ts': 95,'template':'No, handcuffs of ${7}!' },
                        { 'ts':100,'template':'Bruce Lee > ${7}!', 'duration':2 },
                        { 'ts':115.5,'template':'I\'m ${8}!', 'duration': 2 },
                        { 'ts':118,'template':'No, you\'re a dumb Ewok', 'duration': 2 },
                        { 'ts':120,'template':'Shut up stupid!', 'duration':2 },
                        { 'ts':123,'template':'Good comeback ${9}', 'duration':2 },
                        { 'ts':125,'template':'${10}', 'duration':2 },
                        { 'ts':127,'template':'That made no sense', 'duration':2 },
                        { 'ts':129.5,'template':'${6}?', 'duration':2 },
                        { 'ts':131.5,'template':'${2} ${3}!', 'duration':1.5 }
                    ]
                }
            };
        } else
        if (category === 'scifi-fantasy') {
            return {
                'id'         : '3',
                'title'      : 'Heartbreaking Romance',
                'views'      : 1000,
                'src'         : baseUrl + '/media/fantasy/lotr',
                'css'         : baseUrl + '/styles/bubbles_fantasy.css',
                'anim'        : 'fantasy',
                'defSizeLimit': 18,
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
                        'cls'     : ['lotr-${index}', 'annotation']
                        },
                     'notes'  : [
                        { 'ts':  3,'template':'I\'ll always remember' },
                        { 'ts':  5,'template':'The times we ${1} together', 'duration' : 2 },
                        { 'ts':  9,'template':'${2}', 'duration' : 3 },
                        { 'ts': 12,'template':'${3} ${4}', 'duration' : 3},
                        { 'ts': 23,'template':'Wonder if he knows I ${1} with everyone' },
                        { 'ts': 29,'template':'Yes, I know..', 'duration' : 3 },
                        { 'ts': 32,'template':'but I don\'t care', 'duration' : 3 },
                        { 'ts': 35,'template':'Because I ${5} ${6} with Gandalf' },
                        { 'ts': 41,'template':'${3} ${4}', 'duration' : 3 },
                        { 'ts': 49,'template':'What a ${7} ${8}' },
                        { 'ts': 58,'template':'I\'m ready to go to ${9}!' },
                        { 'ts': 63,'template':'Get over here you tiny ${7}', 'duration' : 2 },
                        { 'ts': 68,'template':'I hope they have ${6} in ${9}', 'duration' : 2 },
                        { 'ts': 75,'template':'You sail, I\'m not doing ${7} on this trip', 'duration' : 3},
                        { 'ts': 78,'template':'Hope this ${10} can swim', 'duration' : 2 },
                        { 'ts': 82,'template':'${2}', 'duration' : 4 },
                        { 'ts': 83,'template':'${2}', 'duration' : 3 },
                        { 'ts': 84,'template':'${7} ${8}', 'duration' : 2 },
                        { 'ts': 95,'template':'I just took a ${7} in my pants', 'duration' : 4 }
                    ]
                }
            };
        }
        return  {
                'id'          : '1',
                'title'       : 'Something Special',
                'views'       : 993,
                'src'         : baseUrl + '/media/romance/not_over',
                'css'         : baseUrl + '/styles/bubbles_romance.css',
                'anim'        : 'romance',
                'defSizeLimit': 18,
                'prompts'   : [
                    'strong smell',
                    'bodily function',
                    { query : 'exuberant expression' },
                    'animal',
                    { query : 'animal', sizeLimit : 18},
                    'type of bread',
                    'famous A-list celebrity',
                    'Fight move',
                    'plural vegetable'
                ],
                'annotations' :  {
                    'options' : {
                        'type'       : 'bubble',
                        'duration'   : 4,
                        'cls'        : ['notebook-${index}', 'annotation']
                    },
                    'notes' : [
                       { 'ts':11,'template':'Weird, smells like ${1}!' },
                       { 'ts':16,'template':'Damn she knows I just ${2}.', 'duration' : 3 },
                       { 'ts':19,'template':'Rain Diversion ${3}!', 'duration' : 2 },
                       { 'ts':27,'template':'Casual laugh, think about a mutant ${4} ${5}.', 'duration' : 3 },
                       { 'ts':34,'template':'${4} ${5}!!', 'duration' : 2.5 },
                       { 'ts':38,'template':'Must counter or he\'ll think I\'m boring like ${6}.' },
                       { 'ts':43,'template':'Commence over-acting.  Channel ${7}.' },
                       { 'ts':55,'template':'umm WTF was that? She must ${8} ${9}.', 'duration' : 2.5 },
                       { 'ts':58,'template':'I love ${9}.', 'duration': 2 }
                    ]
                }
            };
    };


    return service;
}]);

})();
