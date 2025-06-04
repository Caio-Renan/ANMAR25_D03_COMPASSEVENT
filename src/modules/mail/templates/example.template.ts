export const exampleTemplate = (variables: { name: string }) => {
  const { name } = variables;

  const html = `
    <h1>Hello, ${name}!</h1>
    <p>Welcome to our service.</p>
  `;

  const text = `Hello, ${name}!\nWelcome to our service.`;

  return { html, text };
};
