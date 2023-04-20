export function getChunkReplaceMarker(id: string) {
  return `--figmaCodeTransformer=${id}`;
}

export function integrateChunkCodes(
  rootCode: string,
  chunks: { id: string; code: string }[]
) {
  let integratedCode = rootCode;
  chunks.forEach((chunk) => {
    if ('id' in chunk) {
      const replace = getChunkReplaceMarker(chunk.id);
      const regex = new RegExp(replace, 'g');
      integratedCode = integratedCode.replace(regex, chunk.code);
    }
  });

  return integratedCode;
}
