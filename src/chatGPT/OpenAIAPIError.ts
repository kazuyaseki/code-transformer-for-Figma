export type OpenAIAPIError = {
  error: {
    code: 'context_length_exceeded';
    message: string;
    param: string;
    type: 'invalid_request_error';
  };
};
