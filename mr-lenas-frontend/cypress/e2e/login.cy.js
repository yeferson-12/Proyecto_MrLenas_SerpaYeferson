describe('Mr. Leñas - Pruebas E2E', () => {

  beforeEach(() => {
    localStorage.clear()
    cy.visit('http://localhost:3000')
  })

  it('Debe cargar la pantalla de login', () => {
    cy.contains('Mr. Leñas').should('be.visible')
    cy.contains('Ingresar').should('be.visible')
  })

  it('Debe rechazar credenciales inválidas', () => {
    cy.get('input[type="email"]').type('malo@test.com')
    cy.get('input[type="password"]').type('incorrecta')
    cy.contains('Ingresar').click()
    cy.contains('inválidas', { timeout: 8000 }).should('be.visible')
  })

  it('Debe iniciar sesión con credenciales válidas', () => {
    cy.get('input[type="email"]').type('admin@mrlenas.com')
    cy.get('input[type="password"]').type('password')
    cy.contains('Ingresar').click()
    cy.contains('Pedidos', { timeout: 8000 }).should('be.visible')
  })

})