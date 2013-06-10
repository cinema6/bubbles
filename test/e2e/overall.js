(function() {
	'use strict';
	
	describe('Screenjacked', function() {
		describe('Categories screen.', function() {
			beforeEach(function() {
				browser().navigateTo('/');
				sleep(2);
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
					//expect();
				});
			});
			
		});
	});
})();