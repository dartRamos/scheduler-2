describe("Appointments", () => {
  // Runs before each test to reset the state and navigate to the homepage
  beforeEach(() => {

   cy.request("GET", "/api/debug/reset");
 
   cy.visit("/");
 
   cy.contains("Monday");
  });
 
  // Tests booking an interview
  it("should book an interview", () => {
   // Click the first "add" button to create a new appointment
   cy.get("[alt=Add]")
    .first()
    .click();
   
   // Fill in the student name input field
   cy.get("[data-testid=student-name-input]")
     .type("Lydia Miller-Jones");
    
   // Select the interviewer by clicking their avatar
   cy.get('[alt="Sylvia Palmer"]')
     .click();
 
   // Clicks the save button
   cy.contains("Save")
     .click();
 
   // Verifies the appointment card displays the right information
   cy.contains(".appointment__card--show", "Lydia Miller-Jones");
   cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  // Tests editing existing interview
  it("should edit an interview", () => {
    cy.get("[alt=Edit")
      .first()
      .click({ force: true })

    // Update the student name after clearing input field
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Lydia Miller-Jones");

    // Change the interviewer to Tori Malcolm
    cy.get('[alt="Tori Malcolm"]')
      .click();

    // Click save interview
    cy.contains("Save")
      .click();

    // Verifies the appointment card displays the right information
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]")
      .click({ force: true });

    cy.contains("Confirm").click();
    
    cy.contains("Deleting")
      .should("exist");
    cy.contains("Deleting")
      .should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  })

 });