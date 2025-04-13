declare module 'merge-source-map' {
  function mergeSourceMap(
    oldMap: string | object | null,
    newMap: string | object,
  ): string | object;
  export default mergeSourceMap;
}
