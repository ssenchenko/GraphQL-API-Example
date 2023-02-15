exports.handler = async (_) => {
  const getNote = /* GraphQL */ `
    query {
      getNote(NoteId: "1") {
        title
        content
      }
    }
  `;

  const saveNote = /* GraphQL */ `
    mutation {
      saveNote(content: "some note", NoteId: "1", title: "1st note") {
        title
        content
      }
    }
  `;

  const doRequest = async (query) => {
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
      body,
    };
  };

  let response = await doRequest(saveNote);
  if (response.statusCode !== 200) {
    return {
      StatusCode: response.statusCode,
      Body: JSON.stringify(response.body),
    };
  }
  let body = {
    saveNote: response.body,
  };

  response = await doRequest(getNote);
  body = {
    ...body,
    getNote: response.body,
  };

  return {
    StatusCode: response.statusCode,
    Body: JSON.stringify(body),
  };
};
