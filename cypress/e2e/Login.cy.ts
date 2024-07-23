import {Message} from "cypress-mailosaur";
function goToLoginAndFill(username: string, password: string) {
    cy.get('[data-test-id="form-input-username"]').type(username)
    cy.get('[data-test-id="form-input-password"]').type(password)
    cy.get('[data-test-id="form-submit-btn"]').click()
}

function existErrorWithNoData() {
    cy.get('[data-test-id="form-error"]')
        .should('exist')
        .should('have.text', 'Необхідні дані для входу')
}

function getLastEmailMessage(){
    cy.mailosaurGetMessage("wdiandkk", {
        sentTo: "poor-rice@wdiandkk.mailosaur.net",
    }, {
        timeout: 20000,
    }).then((email:Message) => {
        if (email.subject != null) {
            cy.log(email.subject);
        }
    });
}

describe('Login', () => {
    beforeEach(() => {
        cy.visit('/login')
    })
    it('login without username and password', () => {
        cy.get('[data-test-id="form-submit-btn"]').click()
        existErrorWithNoData()
    })

    it('login without username', () => {
        cy.get('[data-test-id="form-input-password"]').type('12345')
        cy.get('[data-test-id="form-submit-btn"]').click()
        existErrorWithNoData()
    })

    it('login without password', () => {
        cy.get('[data-test-id="form-input-username"]').type('12345')
        cy.get('[data-test-id="form-submit-btn"]').click()
        existErrorWithNoData()
    })

    it('login failed page should be visible', () => {
        goToLoginAndFill('test', 'test')
        cy.get('[data-test-id="form-error"]').should('exist')
    })

    it('enter failed code page should be visible', () => {
        goToLoginAndFill('misha', '12345')
        cy.get('[data-test-id="form-error"]').should('not.exist')

        cy.get('[data-test-id="modal-header"]')
            .should('exist')
            .should('have.text', 'Підтвердьте свою особу')
        cy.get('[data-test-id="modal-send-button"]').click()
        cy.get('[data-test-id="modal-error"]').should('exist')
    })
})