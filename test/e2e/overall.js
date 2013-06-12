(function() {
	'use strict';
	
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
					
					expect(counter.text()).toBe('24');
					
					for (var i = 0, length = message.length; i < length; i++) {
						textField.enter(message.substring(0, i + 1));
						expect(counter.text()).toBe(24 - (i + 1) + '');
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
		})
	});
})();