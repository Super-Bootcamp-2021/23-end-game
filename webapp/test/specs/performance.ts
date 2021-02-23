describe('performance page', () => {
  it('sould display performance information', () => {
    cy.intercept('/summary', { fixture: 'performance-summary' }).as(
      'getSummary'
    );
    cy.visit('/performance.html');
    cy.wait('@getSummary');
    cy.get('#tasks').should('have.text', '5');
    cy.get('#task-done').should('have.text', '2');
    cy.get('#task-canceled').should('have.text', '3');
    cy.get('#workers').should('have.text', '3');
  });

  it('should be able to refresh information', () => {
    let i = 0;
    cy.intercept('/summary', (req) => {
      if (i > 0) {
        req.reply({
          total_task: 21,
          task_done: 11,
          task_cancelled: 10,
          total_worker: 9,
        });
      } else {
        req.reply({ fixture: 'performance-summary' });
      }
      req.alias = 'getSummary';
      i++;
    });
    cy.visit('/performance.html');
    cy.wait('@getSummary');
    cy.get('#tasks').should('have.text', '5');
    cy.get('#refresh').click();
    cy.get('#loading-text').should('contain.text', 'memuat');
    cy.wait('@getSummary');
    cy.get('#tasks').should('have.text', '21');
    cy.get('#task-done').should('have.text', '11');
    cy.get('#task-canceled').should('have.text', '10');
    cy.get('#workers').should('have.text', '9');
  });

  context('while loading summary', () => {
    it('should display loading indicator', () => {
      cy.intercept('/summary', {
        fixture: 'performance-summary',
      });
      cy.visit('/performance.html');
      cy.get('#loading-text').should('contain.text', 'memuat');
    });
  });

  context('when loading summary failed', () => {
    it('should show failed to load summary error message', () => {
      cy.intercept('/summary', {
        statusCode: 500,
        body: 'unknown server error',
      }).as('getSummary');
      cy.visit('/performance.html');
      cy.wait('@getSummary');
      cy.get('#error-text').should(
        'contain.text',
        'gagal memuat informasi kinerja'
      );
    });
  });
});
