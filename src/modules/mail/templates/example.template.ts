export interface ExampleTemplateVariables {
  name: string;
}

export const exampleTemplate = (variables: ExampleTemplateVariables) => {
  const { name } = variables;

  const subject = 'Welcome!';
  const html = `
    <h1>Hello, ${name}!</h1>
    <p>Welcome to our service.</p>
  `;
  const text = `Hello, ${name}!\nWelcome to our service.`;

  return { subject, html, text };
};
