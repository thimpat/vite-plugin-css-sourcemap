import path from 'node:path';
import type { Plugin } from 'vite';
import mergeSourceMap from 'merge-source-map';
import type {
  NormalizedOutputOptions,
  OutputBundle,
  PluginContext,
  PreRenderedAsset,
  RenderedChunk,
} from 'rollup';
import { EXTENSIONS, PLUGIN_NAME } from './constants';
import { hasValidExtension } from './utils';

export interface CssSourcemapOptions {
  extensions?: string[];
  enabled?: boolean;
  folder?: string;
  getURL?: (fileName: string) => string;
}

export default function cssSourcemapPlugin(
  options: CssSourcemapOptions = {},
): Plugin {
  const {
    extensions = EXTENSIONS,
    enabled = true,
    folder = '',
    getURL = (fileName: string) => fileName,
  } = options;

  if (!enabled) {
    return {
      name: PLUGIN_NAME,
      apply: 'build',
    };
  }

  const assetToId = new Map<string, string[]>();
  const idToMap = new Map<string, string>();

  return {
    name: PLUGIN_NAME,
    apply: 'build',
    buildStart(options) {
      const viteCSSPlugin = options.plugins.find(
        (plugin) => plugin.name === 'vite:css-post',
      );

      if (!viteCSSPlugin) {
        throw new Error('vite:css-post plugin not found.');
      }

      const augmentChunkHashHandler = {
        apply: function (
          target: (this: PluginContext, chunk: RenderedChunk) => string | void,
          thisArg: PluginContext,
          argumentsList: any[],
        ) {
          const [chunk] = argumentsList;
          const result = Reflect.apply(target, thisArg, argumentsList);

          if (!result) {
            return result;
          }

          for (const id of chunk.moduleIds) {
            if (hasValidExtension(id, extensions)) {
              if (assetToId.has(result)) {
                assetToId.get(result)?.push(id);
              } else {
                assetToId.set(result, [id]);
              }
            }
          }

          return result;
        },
      };

      const currentMethod = viteCSSPlugin['augmentChunkHash']!;
      const augmentChunkHashProxy = new Proxy(
        currentMethod,
        augmentChunkHashHandler,
      );

      Object.defineProperty(viteCSSPlugin, 'augmentChunkHash', {
        value: augmentChunkHashProxy,
      });
    },

    async transform(code, id) {
      if (hasValidExtension(id, extensions)) {
        const fileName = path.parse(id).name.replace('.module', '');
        const combinedSourcemap = this.getCombinedSourcemap();
        const referenceIdMap = this.emitFile({
          type: 'asset',
          name: `${fileName}.map`,
          source: combinedSourcemap.toString(),
        });

        idToMap.set(id, referenceIdMap);

        return {
          code: code,
          map: combinedSourcemap,
        };
      }

      return null;
    },

    async generateBundle(_: NormalizedOutputOptions, bundle: OutputBundle) {
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type === 'asset' && fileName.endsWith('.css')) {
          const sourceFileIds = assetToId.get(fileName) || [];
          const newMapFileName = `${asset.fileName}.map`;

          const finalSourceMap = sourceFileIds.reduce(
            (mergedMap: string | object | null, refId: string) => {
              const mapReferenceId = idToMap.get(refId);
              if (!mapReferenceId) return mergedMap;

              const mapFileName = this.getFileName(mapReferenceId);
              const generatedMap = (bundle[mapFileName] as PreRenderedAsset)
                ?.source;

              delete bundle[mapFileName];

              return mergeSourceMap(mergedMap, generatedMap);
            },
            null,
          );

          const mapReferencePath = path.basename(newMapFileName);
          const outputPath = path.dirname(newMapFileName);

          this.emitFile({
            type: 'asset',
            fileName: path.join(outputPath, folder, mapReferencePath),
            source:
              typeof finalSourceMap === 'string'
                ? finalSourceMap
                : JSON.stringify(finalSourceMap),
          });

          asset.source += `\n/*# sourceMappingURL=${getURL(mapReferencePath)} */`;
        }
      }
    },
  };
}
