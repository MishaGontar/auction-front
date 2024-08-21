export function verifyAndExtractCode(email: string) {
    return cy.mailosaurGetMessage(Cypress.env('MAILOSAUR_SERVER_ID'),
        {sentTo: email},
        {timeout: 10000}
    ).then((email) => {
        expect(email.subject).to.include("Підтвердьте електронну адресу AuctionPulse");
        expect(email.from?.length).is.greaterThan(0);
        if (email.from && email.from.length > 0) {
            expect(email.from[0].email).include("sistemstatic2023@gmail.com");
        }
        expect(email.html?.body).include("Ваш код для підтвердження особи:");
        const body = email.html?.body;
        const match = body?.match(/<strong>(.*?)<\/strong>/);
        const code = match ? match[1] : null;
        expect(code).to.not.be.null;
        if (code === null) {
            throw new Error("Code not found in email body");
        }
        cy.get('[data-test-id="modal-enter-code"]').type(code);
        cy.get('[data-test-id="modal-send-button"]').click();
        cy.get('[data-test-id="auction-list"]').should('exist');
        cy.get('[data-test-id="avatar"]').should('exist');
    });
}