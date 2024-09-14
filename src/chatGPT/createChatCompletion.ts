type Chat = { role: 'user' | 'assistant'; content: string };

async function fetchStream(stream: any) {
  const reader = stream.getReader();
  let charsReceived = 0;

  let chunks: Uint8Array = new Uint8Array([]);

  await reader
    .read()
    .then(function processText({
      done,
      value,
    }: {
      done: boolean;
      value: Uint8Array;
    }) {
      if (done) {
        console.log('Stream complete');
        return chunks;
      }
      charsReceived += value.length;
      const chunk = value;
      console.log(
        `Received ${charsReceived} characters so far. Current chunk = ${chunk}`
      );

      chunks = new Uint8Array([...chunks, ...chunk]);
      return reader.read().then(processText);
    });
  const decorder = new TextDecoder();
  const resultString = decorder.decode(chunks);

  const response = JSON.parse(resultString);
  return response;
}

function removeMarkdown(str: string) {
  return str.replace(/\`\`\`tsx/g, '').replace(/\`\`\`/g, '');
}

export async function createChatCompletion(
  aoiUrl: string,
  openAIAPIKey: string,
  chat: string,
  previousChats: Chat[]
) {
  const DEFAULT_PARAMS = {
    messages: [...previousChats, { role: 'user', content: chat }],
    temperature: 0,
  };
  const params_ = { ...DEFAULT_PARAMS };
  const result = await fetch(aoiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': openAIAPIKey
    },
    body: JSON.stringify(params_),
  });
  const stream = result.body;
  const output = await fetchStream(stream);

  const outputContent = output.choices[0].message.content;

  try {
    const content = decodeURIComponent(outputContent);
    return removeMarkdown(content);
  } catch (e) {
    console.log(e);
    return removeMarkdown(outputContent);
  }
}
