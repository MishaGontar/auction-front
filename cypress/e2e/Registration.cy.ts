import {verifyAndExtractCode} from "../support/emailUtils.ts";

describe('Registration', () => {
    beforeEach(() => {
        cy.visit('/login')
        cy.get('[data-key="registration"]')
            .should('have.attr', 'aria-selected', 'false')
            .click()
            .should('have.attr', 'aria-selected', 'true')
    })

    it('Registration page is exist', () => {
        cy.get('[data-test-id="form-title"]').should('exist')
    })

    it('too short username', () => {
        cy.get(`[aria-label="Ім'я користувача"]`).type("w").type("{enter}")
        cy.get('[data-test-id="form-error"]').should('exist')
    })

    it('email is not valid', () => {
        cy.get(`[aria-label="Електрона адреса"]`).type('w')

        cy.get(`[aria-label="Ім'я користувача"]`).click()
        cy.xpath(`//div[contains(text(),'Електронна адреса має містити знак "@"')]`).should('exist')
    })

    it('passwords do not match', () => {
        cy.get(`[aria-label="Пароль"]`).type('w')

        cy.get('[data-test-id="form-submit-btn"]').click()
        cy.xpath('//div[contains(text(),"Паролі не співпадають")]').should('exist')
    })

    it('show error when user already exists', () => {
        fillData(Cypress.env('USERNAME'), 'test@gmail.com')
        cy.get('[data-test-id="form-error"]')
            .should('exist')
            .should('contain.text', 'Користувач із цим логіном або електронною поштою вже існує!')
    })

    it('show error when email already exists', () => {
        fillData('12345', Cypress.env('EMAIL'))
        cy.get('[data-test-id="form-error"]')
            .should('exist')
            .should('contain.text', 'Користувач із цим логіном або електронною поштою вже існує!')
    })

    it('should show modal error', () => {
        const {email, username} = getRandomEmailAndUsername();

        fillData(username, email)
        cy.get('[data-test-id="form-error"]').not('exist')

        cy.get('[data-test-id="modal-header"]')
            .should('exist')
            .should('have.text', 'Підтвердьте свою особу')
        cy.get('[data-test-id="modal-send-button"]').should('exist')
        cy.get('[data-test-id="modal-send-button"]').click()
        cy.get('[data-test-id="modal-error"]').should('exist')
    })

    it('should show main page after registration', () => {
        const email = `test${Math.floor(Math.random() * 1000)}@${Cypress.env('MAILOSAUR_SERVER_ID')}.mailosaur.net`
        const username = `test_${Math.floor(Math.random() * 1000)}_delete_me`
        fillData(username, email)
        cy.get('[data-test-id="form-error"]').not('exist')
        verifyAndExtractCode(email)
    })
})

function fillData(username: string, email: string) {
    cy.get(`[aria-label="Ім'я користувача"]`).type(username)
    cy.get(`[aria-label="Електрона адреса"]`).type(email)
    cy.get(`[aria-label="Пароль"]`).type('12345')
    cy.get(`[aria-label="Повторіть пароль"]`).type('12345')

    cy.get('[data-test-id="form-submit-btn"]').click()
}

function getRandomEmailAndUsername(): { username: string, email: string } {
    const email = `test${Math.floor(Math.random() * 1000)}@gmail.com`
    const username = `test_${Math.floor(Math.random() * 1000)}_delete_me`
    return {
        username,
        email
    }
}