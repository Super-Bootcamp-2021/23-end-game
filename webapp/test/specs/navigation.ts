describe('navigation', () => {
  it('should navigate to performance page', () => {
    cy.visit('/');
    cy.get('a').contains('pekerja').click();
    cy.url().should('contain', 'worker.html');
  });

  it('should navigate to performance page', () => {
    cy.visit('/');
    cy.get('a').contains('pekerjaan').click();
    cy.url().should('contain', 'tasks.html');
  });

  it('should navigate to performance page', () => {
    cy.visit('/');
    cy.get('a').contains('kinerja').click();
    cy.url().should('contain', 'performance.html');
  });
});
