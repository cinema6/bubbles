(function() {
	'use strict';
	
	angular.scenario.dsl('checkForBubbles', function() {
		return function(videoSelector, experience) {
			return this.addFutureAction('checking for bubbles in the video', function(appWindow, $document, done) {
				var video = $document.find(videoSelector);
				
				video.on('timeupdate', function(event) {
					var time = event.target.currentTime;
					
					if (time === event.target.duration) {
						done(null, true);
					}
					
					experience.annotations.notes.forEach(function(annotation, index) {
						if (time >= annotation.ts && time <= annotation.ts + (annotation.duration || experience.annotations.options.duration)) {
							var bubble = $document.find('.lee-' + index);
							
							if (bubble.css('display') === 'none') {
								done('expected bubble with timestamp ' + annotation.ts + ' to be visisble', false);
							}
						}
					});
				});
			});
		}
	});
	
	describe('Screenjacked', function() {
		describe('The categories screen', function() {
			beforeEach(function() {
				sleep(1);
				browser().navigateTo('/');
				sleep(1);
			});
			
			it('should display a list of categories.', function() {
				expect(element('.category__item').count()).toBeGreaterThan(1);
			});
			describe('clicking on a category.', function() {
				beforeEach(function() {
					element('button.category__frame[name="Action"]').click();
					sleep(4);
				});
				
				it('should load the input screen.', function() {
					expect(element('div.inputScreen').count()).toBe(1);
				});
				it('should change the url.', function() {
					expect(browser().window().hash()).toBe('/entry/action');
				});
			});
		});
		describe('The input screen', function() {
			beforeEach(function() {
				sleep(1);
				browser().navigateTo('/#entry/action');
				sleep(1);
			});
			
			it('should display the first prompt.', function() {
				expect(element('h2.question__query').text()).toContain('Salutation');
			});
			describe('the textfield', function() {
				it('should update the counter as you type.', function() {
					var counter = element('.question__characterCount'),
						textField = input('inputCtrl.promptModel.responses[inputCtrl.currentPromptIndex()]'),
						message = 'Hello!';
					
					expect(counter.text()).toBe('18');
					
					for (var i = 0, length = message.length; i < length; i++) {
						textField.enter(message.substring(0, i + 1));
						expect(counter.text()).toBe(18 - (i + 1) + '');
					}
				});
			});
			describe('the previous/next buttons', function() {
				var textField,
					prev,
					next,
					query,
					responses = ['Hello!', 'Dog', 'Superman', 'Knees', 'Apples', 'Oink!', 'Zeus', 'Luke Skywalker', 'Roseanne', 'Butterfinger'],
					prompts = ['Salutation', 'Animal', 'Superhero', 'Body Part (plural)', 'Plural noun', 'Animal Noise', 'Greek God', 'Character from Star Wars', '80\'s female sitcom star', 'Type of candy'];
				beforeEach(function() {
					textField = input('inputCtrl.promptModel.responses[inputCtrl.currentPromptIndex()]');
					query = element('.question__query');
					prev = element('.question__btnPrevious');
					next = element('.question__btnNext');
				});
								
				it('should cycle through the prompts/responses', function() {
					prompts.forEach(function(prompt, index) {
						expect(query.text()).toContain(prompt);
						textField.enter(responses[index]);
						if (index !== 9) {
							next.click();
							sleep(2);
						}
					});
					
					for (var i = prompts.length; i--;) {
						expect(query.text()).toContain(prompts[i]);
						expect(textField.val()).toBe(responses[i]);
						if (i) {
							prev.click();
							sleep(2);
						}
					}
				});
				
				it('should disable/enable when appropriate', function() {
					prompts.forEach(function(prompt, index) {
						if (index === 0) {
							expect(prev.attr('disabled')).toBe('disabled');
							expect(next.attr('disabled')).toBe('disabled');
							textField.enter(responses[index]);
							expect(prev.attr('disabled')).toBe('disabled');
							expect(next.attr('disabled')).toBe(undefined);
							next.click();
							sleep(2);
						} else if (index === 9) {
							expect(prev.attr('disabled')).toBe(undefined);
							expect(next.attr('disabled')).toBe('disabled');
							textField.enter(responses[index]);
							expect(prev.attr('disabled')).toBe(undefined);
							expect(next.attr('disabled')).toBe('disabled');
						} else {
							expect(prev.attr('disabled')).toBe(undefined);
							expect(next.attr('disabled')).toBe('disabled');
							textField.enter(responses[index]);
							expect(prev.attr('disabled')).toBe(undefined);
							expect(next.attr('disabled')).toBe(undefined);
							next.click();
							sleep(2);
						}
					});
				});
			});
			describe('the progress indicators', function() {
				var textField,
					prev,
					next,
					questionNumber,
					progressDock,
					responses = ['Hello!', 'Dog', 'Superman', 'Knees', 'Apples', 'Oink!', 'Zeus', 'Luke Skywalker', 'Roseanne', 'Butterfinger'];
				beforeEach(function() {
					textField = input('inputCtrl.promptModel.responses[inputCtrl.currentPromptIndex()]');
					prev = element('.question__btnPrevious');
					next = element('.question__btnNext');
					questionNumber = element('.question__number');
					progressDock = element('.progressDock');
				});
				
				it('should reflect the progress of entering responses.', function() {
					responses.forEach(function(response, index) {
						expect(questionNumber.text()).toBe('Question ' + (index + 1));
						expect(progressDock.text()).toBe('Page ' + (index + 1) + ' of 10');
						textField.enter(response);
						
						if (index !== 9) {
							next.click();
							sleep(2);
						}
					});
				});
			});
			describe('the start button', function() {
				var textField,
					prev,
					next,
					start,
					responses = ['Hello!', 'Dog', 'Superman', 'Knees', 'Apples', 'Oink!', 'Zeus', 'Luke Skywalker', 'Roseanne', 'Butterfinger'];
				beforeEach(function() {
					textField = input('inputCtrl.promptModel.responses[inputCtrl.currentPromptIndex()]');
					prev = element('.question__btnPrevious');
					next = element('.question__btnNext');
					start = element('.question__btnStart');
				});
				
				it('should only be in the DOM when the final question is on-screen.', function() {
					responses.forEach(function(response, index) {
						if (index !== 9) {
							expect(start.count()).toBe(0);
							textField.enter(response);
							next.click();
							sleep(2);
						} else {
							expect(start.count()).toBe(1);
						}
					});
				});
				it('should be disabled until you enter the final response', function() {
					responses.forEach(function(response, index) {
						if (index !== 9) {
							textField.enter(response);
							next.click();
							sleep(2);
						} else {
							expect(start.attr('disabled')).toBe('disabled');
							textField.enter(response);
							expect(start.attr('disabled')).toBe(undefined);
						}
					});
				});
				
				describe('clicking', function() {
					beforeEach(function() {
						responses.forEach(function(response, index) {
							textField.enter(response);
							
							if (index !== 9) {
								next.click();
								sleep(2);
							}
						});
						
						start.click();
						sleep(3);
					});
					
					it('should autoplay the video.', function() {
						expect(element('#player').prop('paused')).toBe(false);
					});
					it('should change the url', function() {
						expect(browser().window().hash()).toBe('/entry/action/experience');
					});
				});
			});
		});
		describe('the experience', function() {
			var textField,
				next,
				start,
				video,
				responses = ['Hello!', 'Dog', 'Superman', 'Knees', 'Apples', 'Oink!', 'Zeus', 'Luke Skywalker', 'Roseanne', 'Butterfinger'];
			beforeEach(function() {
				sleep(1);
				browser().navigateTo('/#entry/action');
				sleep(1);
				
				textField = input('inputCtrl.promptModel.responses[inputCtrl.currentPromptIndex()]');
				next = element('.question__btnNext');
				start = element('.question__btnStart');
				video = element('#player');
				
				responses.forEach(function(response, index) {
					textField.enter(response);
					if (index !== 9) {
						next.click();
						sleep(1.5);
					} else {
						start.click();
						sleep(3);
					}
				});
			});
			
			it('should display the video', function() {
				sleep(1);
				expect(video.css('opacity')).toBe('1');
			});
			it('should display the annotations at the correct moments in the video.', function() {
				var $injector = angular.injector(['ng', 'c6.app']),
					$q = $injector.get('$q'),
					vsvc = $injector.get('c6VideoListingService');
									
				expect(checkForBubbles('#player', vsvc.getExperienceByCategory('action'))).toBe(true);
			});
			it('should transition to the end screen when the video ends.', function() {
				video.query(function(videoEl, done) {
					videoEl.on('timeupdate', function(event) {
						if (event.target.currentTime === event.target.duration) {
							done();
						}
					});
				});
				sleep(3);
				
				expect(element('.endScreen').count()).toBe(1);
				expect(browser().window().hash()).toBe('/entry/action/end');
			});
		});
		describe('the end screen', function() {
			beforeEach(function() {
				sleep(1);
				browser().navigateTo('/#/entry/action/end');
				sleep(1);
			});
			
			describe('the replay button', function() {
				it('should return to the experience.', function() {
					element('.vidMenu__btnReplay').click();
					sleep(5);
					
					expect(browser().window().hash()).toBe('/entry/action/experience');
					expect(element('#player').css('opacity')).toBe('1');
				});
			});
			describe('the make a new video button', function() {
				it('should return to the categories page.', function() {
					element('.vidMenu__btnNewVid').click();
					sleep(4);
					
					expect(browser().window().hash()).toBe('/');
					expect(element('.startScreen').count()).toBe(1);
				});
			});
		});
	});
})();