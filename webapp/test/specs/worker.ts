describe('worker management page', () => {
  describe('register worker', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'worker-list' }).as('getWorkerList');
    });

    it('should register new worker', () => {
      cy.intercept('/register', { fixture: 'new-worker' }).as('registerWorker');
      cy.visit('/worker.html');
      cy.wait('@getWorkerList');
      cy.get('#name').type('andi');
      cy.get('#age').type('21');
      cy.get('#photo').attachFile('file.png');
      cy.get('#bio').type('menjadi diri sendiri');
      cy.get('#address').type('jl. jeruk 98');
      cy.get('#form').submit();
      cy.wait('@registerWorker');
      cy.get('#list').children().should('have.length', 3);
      cy.get('.item').eq(2).should('contain.text', 'andi');
    });

    context('when form incomplete', () => {
      it('should show form incomplete error message', () => {
        cy.visit('/worker.html');
        cy.wait('@getWorkerList');
        cy.get('#name').type('andi');
        cy.get('#form').submit();
        cy.get('#error-text').should(
          'contain.text',
          'form isian tidak lengkap!'
        );
        cy.get('#age').type('21');
        cy.get('#form').submit();
        cy.get('#error-text').should(
          'contain.text',
          'form isian tidak lengkap!'
        );
        cy.get('#photo').attachFile('file.png');
        cy.get('#form').submit();
        cy.get('#error-text').should(
          'contain.text',
          'form isian tidak lengkap!'
        );
        cy.get('#bio').type('menjadi diri sendiri');
        cy.get('#form').submit();
        cy.get('#error-text').should(
          'contain.text',
          'form isian tidak lengkap!'
        );
        cy.get('#address').type('jl. jeruk 98');
        cy.get('#name').clear();
        cy.get('#form').submit();
        cy.get('#error-text').should(
          'contain.text',
          'form isian tidak lengkap!'
        );
      });
    });

    context('when service failed to register worker', () => {
      it('should show failed to register worker error', () => {
        cy.intercept('/register', {
          statusCode: 500,
          body: 'internal server error',
        }).as('registerWorker');
        cy.visit('/worker.html');
        cy.wait('@getWorkerList');
        cy.get('#name').type('andi');
        cy.get('#age').type('21');
        cy.get('#photo').attachFile('file.png');
        cy.get('#bio').type('menjadi diri sendiri');
        cy.get('#address').type('jl. jeruk 98');
        cy.get('#form').submit();
        cy.wait('@registerWorker');
        cy.get('#error-text').should('contain.text', 'gagal mendaftarkan');
      });
    });
  });

  describe('worker list', () => {
    it('should display all worker', () => {
      cy.intercept('/list', { fixture: 'worker-list' }).as('getWorkerList');
      cy.visit('/worker.html');
      cy.wait('@getWorkerList');
      cy.get('#list').children().should('have.length', 2);
      cy.get('.item').eq(0).should('contain.text', 'budi');
      cy.get('.item').eq(1).should('contain.text', 'susi');
    });

    context('while loading data', () => {
      it('should display loading indicator', () => {
        cy.intercept('/list', { fixture: 'worker-list' }).as('getWorkerList');
        cy.visit('/worker.html');
        cy.get('#loading-text').should('contain.text', 'memuat');
      });
    });

    context('when loading workers failed', () => {
      it('should show failed to load worker list error message', () => {
        cy.intercept('/list', {
          statusCode: 500,
          body: 'internal server error',
        }).as('getWorkerList');
        cy.visit('/worker.html');
        cy.wait('@getWorkerList');
        cy.get('#error-text').should(
          'contain.text',
          'gagal memuat daftar pekerja'
        );
      });
    });
  });

  describe('remove worker', () => {
    beforeEach(() => {
      cy.intercept('/list', { fixture: 'worker-list' }).as('getWorkerList');
    });

    it('should remove worker from list', () => {
      cy.intercept('/remove', { fixture: 'task' }).as('removeWorker');
      cy.visit('/worker.html');
      cy.wait('@getWorkerList');
      cy.get('.item').eq(0).children('button.remove').click();
      cy.wait('@removeWorker');
      cy.get('#list').children().should('have.length', 1);
      cy.get('.item').eq(0).should('contain.text', 'susi');
    });

    context('when service failed to remove worker', () => {
      it('should show failed to remove worker error', () => {
        cy.intercept('/remove', {
          statusCode: 500,
          body: 'internal server error',
        }).as('removeWorker');
        cy.visit('/worker.html');
        cy.wait('@getWorkerList');
        cy.get('.item').eq(0).children('button.remove').click();
        cy.wait('@removeWorker');
        cy.get('#error-text').should('contain.text', 'gagal menghapus pekerja');
      });
    });
  });
});
