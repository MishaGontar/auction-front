import {verifyAndExtractCode} from "../support/emailUtils.ts";

const login = Cypress.env('USERNAME');
const password = Cypress.env('PASSWORD');

if (!login || !password) {
    throw new Error('USERNAME and PASSWORD must be defined');
}

function fillLogin(username: string, password: string) {
    cy.get('[data-test-id="form-input-username"]').type(username)
    cy.get('[data-test-id="form-input-password"]').type(password)
    cy.get('[data-test-id="form-submit-btn"]').click()
}

function existErrorWithNoData() {
    cy.get('[data-test-id="form-error"]')
        .should('exist')
        .should('have.text', 'Необхідні дані для входу')
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
        fillLogin('test', 'test')
        cy.get('[data-test-id="form-error"]').should('exist')
    })

    it('enter failed code page should be visible', () => {
        fillLogin(login, password)
        cy.get('[data-test-id="form-error"]').should('not.exist')

        cy.get('[data-test-id="modal-header"]')
            .should('exist')
            .should('have.text', 'Підтвердьте свою особу')
        cy.get('[data-test-id="modal-send-button"]').click()
        cy.get('[data-test-id="modal-error"]').should('exist')
    })

    it('fill correct code', () => {
        fillLogin(login, password)
        cy.get('[data-test-id="form-error"]').should('not.exist')

        cy.get('[data-test-id="modal-header"]')
            .should('exist')
            .should('have.text', 'Підтвердьте свою особу')

        verifyAndExtractCode(Cypress.env('EMAIL'));
    })
})