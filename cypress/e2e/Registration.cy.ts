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
        cy.get(`[aria-label="Ім'я користувача"]`)
            .focus()
            .type("w")
            .should('have.value', 'w')
            .type("{enter}")
        cy.get('[data-test-id="form-error"]').should('exist')
    })

    it('email is not valid', () => {
        cy.get(`[aria-label="Електрона адреса"]`)
            .type('w')
            .should('have.value', 'w')
        cy.get(`[aria-label="Ім'я користувача"]`).click()
        cy.xpath(`//div[contains(text(),'Електронна адреса має містити знак "@"')]`).should('exist')
    })
})