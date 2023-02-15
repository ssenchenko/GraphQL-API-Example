exports.handler = async (_) => {
  const query = /* GraphQL */ `
    query {
      getNote(NoteId: "2") {
        title
        content
      }
    }
  `;

  const options = {
    method: "POST",
    headers: {
      "x-api-key": process.env.API_KEY,
    },
    body: JSON.stringify({ query }),
  };

  let statusCode = 200;
  let body;
  let response;

  try {
    /*global fetch*/
    response = await fetch(process.env.GRAPHQL_URL, options);
    body = await response.json();
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 400;
    body = {
      errors: [
        {
          status: response.status,
          message: error.message,
          stack: error.stack,
        },
      ],
    };
  }

  return {
    statusCode,
    body: JSON.stringify(body),
  };
};
