export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

// Cliente por defecto para los escenarios donde los datos de envío no son lo que estoy probando.
export const defaultCustomer: Customer = {
  firstName: 'Ana',
  lastName: 'Torres',
  postalCode: '15001',
};
