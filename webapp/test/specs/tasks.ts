describe('task management page', () => {
  describe('add new task', () => {
    beforeEach(() => {
      cy.intercept('http://localhost:7001/list', { fixture: 'worker-list' }).as(
        'getWorkerList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks-list' }).as(
        'getTasksList'
      );
    });

    it('should add new task', () => {
      cy.intercept('/add', { fixture: 'new-task' }).as('addNewTask');
      cy.visit('/tasks.html');
      cy.wait(['@getTasksList', '@getWorkerList']);
      cy.get('#job').type('mencari sesuap nasi');
      cy.get('#assignee').select('susi');
      cy.get('#attachment').attachFile('file.png');
      cy.get('#form').submit();
      cy.wait('@addNewTask');
      cy.get('#list').children().should('have.length', 3);
      cy.get('.item').eq(2).should('contain.text', 'mencari sesuap nasi');
      cy.get('.item').eq(2).should('contain.text', 'budi');
      cy.get('.item:eq(2) a').should(
        'have.attr',
        'href',
        'http://localhost:7002/attachment/file.png'
      );
    });

    context('when form incomplete', () => {
      it('should show form incomplete error message', () => {
        cy.visit('/tasks.html');
        cy.wait(['@getTasksList', '@getWorkerList']);
        cy.get('#job').type('mencari sesuap nasi');
        cy.get('#form').submit();
        cy.get('#error-text').should(
          'contain.text',
          'form isian tidak lengkap!'
        );
        cy.get('#assignee').select('susi');
        cy.get('#form').submit();
        cy.get('#error-text').should(
          'contain.text',
          'form isian tidak lengkap!'
        );
        cy.get('#job').clear();
        cy.get('#attachment').attachFile('file.png');
        cy.get('#form').submit();
        cy.get('#error-text').should(
          'contain.text',
          'form isian tidak lengkap!'
        );
      });
    });

    context('when service failed to add task', () => {
      it('should show failed to add data error', () => {
        cy.intercept('/add', {
          statusCode: 500,
          body: 'internal server error',
        }).as('addNewTask');
        cy.visit('/tasks.html');
        cy.wait(['@getTasksList', '@getWorkerList']);
        cy.get('#job').type('mencari sesuap nasi');
        cy.get('#assignee').select('susi');
        cy.get('#attachment').attachFile('file.png');
        cy.get('#form').submit();
        cy.wait('@addNewTask');
        cy.get('#error-text').should('contain.text', 'gagal menambahkan');
      });
    });
  });

  describe('task list', () => {
    it('should display non cancelled task', () => {
      cy.intercept('http://localhost:7001/list', { fixture: 'worker-list' }).as(
        'getWorkerList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks-list' }).as(
        'getTasksList'
      );
      cy.visit('/tasks.html');
      cy.wait(['@getTasksList', '@getWorkerList']);
      cy.get('#list').children().should('have.length', 2);
      cy.get('.item').eq(0).should('contain.text', 'memecah kebuntuan');
      cy.get('.item').eq(0).should('contain.text', 'budi');
      cy.get('.item').eq(0).get('button.cancel').should('exist');
      cy.get('.item').eq(0).get('button.done').should('exist');
      cy.get('.item:eq(0) a').should(
        'have.attr',
        'href',
        'http://localhost:7002/attachment/blueprint.pdf'
      );
      cy.get('.item').eq(1).should('contain.text', 'bekerja keras');
      cy.get('.item').eq(1).should('contain.text', 'susi');
      cy.get('.item').eq(1).should('contain.text', 'sudah selesai');
      cy.get('.item:eq(1) a').should(
        'have.attr',
        'href',
        'http://localhost:7002/attachment/prototype.pdf'
      );
    });

    context('while loading data', () => {
      it('should display loading indicator', () => {
        cy.intercept('http://localhost:7001/list', {
          fixture: 'worker-list',
        }).as('getWorkerList');
        cy.intercept('http://localhost:7002/list', {
          fixture: 'tasks-list',
        });
        cy.visit('/tasks.html');
        cy.get('#loading-text').should('contain.text', 'memuat');
      });
    });

    context('when loading workers failed', () => {
      it('should show failed to load worker list error message', () => {
        cy.intercept('http://localhost:7001/list', {
          fixture: 'worker-list',
        }).as('getWorkerList');
        cy.intercept('http://localhost:7002/list', {
          statusCode: 500,
          body: 'internal server error',
        }).as('getTasksList');
        cy.visit('/tasks.html');
        cy.wait('@getTasksList');
        cy.get('#error-text').should(
          'contain.text',
          'gagal memuat daftar pekerjaan'
        );
      });
    });

    context('when loading tasks failed', () => {
      it('should show failed to load task data error message', () => {
        cy.intercept('http://localhost:7001/list', {
          statusCode: 500,
          body: 'internal server error',
        }).as('getWorkerList');
        cy.intercept('http://localhost:7002/list', {
          fixture: 'tasks-list',
        }).as('getTasksList');
        cy.visit('/tasks.html');
        cy.wait('@getWorkerList');
        cy.get('#error-text').should(
          'contain.text',
          'gagal memuat daftar pekerja'
        );
      });
    });
  });

  describe('cancel task', () => {
    beforeEach(() => {
      cy.intercept('http://localhost:7001/list', { fixture: 'worker-list' }).as(
        'getWorkerList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks-list' }).as(
        'getTasksList'
      );
    });

    it('should remove task from list', () => {
      cy.intercept('/cancel', { fixture: 'task' }).as('cancelTask');
      cy.visit('/tasks.html');
      cy.wait(['@getTasksList', '@getWorkerList']);
      cy.get('.item').eq(0).get('button.cancel').click();
      cy.wait('@cancelTask');
      cy.get('#list').children().should('have.length', 1);
      cy.get('.item').eq(0).should('contain.text', 'bekerja keras');
    });

    context('when service failed to cancel task', () => {
      it('should show failed to cancel task error', () => {
        cy.intercept('/cancel', {
          statusCode: 500,
          body: 'internal server error',
        }).as('cancelTask');
        cy.visit('/tasks.html');
        cy.wait(['@getTasksList', '@getWorkerList']);
        cy.get('.item').eq(0).get('button.cancel').click();
        cy.wait('@cancelTask');
        cy.get('#error-text').should(
          'contain.text',
          'gagal membatalkan pekerjaan'
        );
      });
    });
  });

  describe('finish task', () => {
    beforeEach(() => {
      cy.intercept('http://localhost:7001/list', { fixture: 'worker-list' }).as(
        'getWorkerList'
      );
      cy.intercept('http://localhost:7002/list', { fixture: 'tasks-list' }).as(
        'getTasksList'
      );
    });

    it('should mark task as finish', () => {
      cy.intercept('/done', { fixture: 'task' }).as('finishTask');
      cy.visit('/tasks.html');
      cy.wait(['@getTasksList', '@getWorkerList']);
      cy.get('.item').eq(0).get('button.done').click();
      cy.wait('@finishTask');
      cy.get('#list').children().should('have.length', 2);
      cy.get('.item').eq(0).should('contain.text', 'memecah kebuntuan');
      cy.get('.item').eq(0).get('button.cancel').should('not.exist');
      cy.get('.item').eq(0).get('button.done').should('not.exist');
      cy.get('.item').eq(0).should('contain.text', 'sudah selesai');
    });

    context('when service failed to finish task', () => {
      it('should show failed to finish task error', () => {
        cy.intercept('/done', {
          statusCode: 500,
          body: 'internal server error',
        }).as('finishTask');
        cy.visit('/tasks.html');
        cy.wait(['@getTasksList', '@getWorkerList']);
        cy.get('.item').eq(0).get('button.done').click();
        cy.wait('@finishTask');
        cy.get('#error-text').should(
          'contain.text',
          'gagal menyelesaikan pekerjaan'
        );
      });
    });
  });
});
