exports.handler = async (_) => {
  const queries = {
    getNote: /* GraphQL */ `
      query {
        getNote(NoteId: "1") {
          title
          content
        }
      }
    `,
    saveNote: /* GraphQL */ `
      mutation {
        saveNote(content: "some note", NoteId: "1", title: "1st note") {
          title
          content
        }
      }
    `,
  };

  const makeRequest = async (queryName) => {
    const options = {
      method: "POST",
      headers: {
        "x-api-key": process.env.API_KEY,
      },
      body: JSON.stringify({ query: queries[queryName] }),
    };

    let statusCode;
    let body;
    let response;

    try {
      /*global fetch*/
      response = await fetch(process.env.GRAPHQL_URL, options);
      body = await response.json();
      const data = body.data?.[queryName];
      const hasNoErrors = body.errors === undefined;
      const allFieldsAreSet =
        data?.title === "1st note" && data?.content === "some note";
      statusCode = hasNoErrors && allFieldsAreSet ? 200 : 400;
      if (hasNoErrors) {
        body = body.data;
      } else {
        body = {
          [queryName]: {
            errors: body.errors,
          },
        };
      }
    } catch (error) {
      statusCode = 400;
      body = {
        [queryName]: {
          errors: [
            {
              status: response.status,
              message: error.message,
              stack: error.stack,
            },
          ],
        },
      };
    }
    return {
      statusCode,
      body,
    };
  };

  let response = await makeRequest("saveNote");
  if (response.statusCode !== 200) {
    return {
      StatusCode: response.statusCode,
      Body: response.body,
    };
  }
  let body = response.body;

  response = await makeRequest("getNote");
  body = { ...body, ...response.body };

  return {
    StatusCode: response.statusCode,
    Body: body,
  };
};
