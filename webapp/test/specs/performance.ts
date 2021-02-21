describe('performance page', () => {
  it('sould display performance information', () => {
    cy.intercept('/summary', {
      total_task: 5,
      task_done: 2,
      task_cancelled: 3,
      total_worker: 3,
    }).as('getSummary');
    cy.visit('/performance.html');
    cy.wait('@getSummary');
    cy.get('#tasks').should('have.text', '5');
    cy.get('#task-done').should('have.text', '2');
    cy.get('#task-canceled').should('have.text', '3');
    cy.get('#workers').should('have.text', '3');
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
