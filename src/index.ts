import { createFilter, FilterPattern } from "@rollup/pluginutils";
import fs from "fs";
import { resolve } from "path";
import type { Plugin, ResolvedConfig } from "vite";
/**
 * @param inlineLimit (kb)
 */
export interface VitePluginCssSvgOptions {
  exclude?: FilterPattern;
  include?: FilterPattern;
  inlineLimit?: number;
}

export default function CssSvgInlinePlugin({
  include = [/\.s?css/, /\.less/],
  exclude,
  inlineLimit = 10,
}: VitePluginCssSvgOptions = {}): Plugin {
  const filter = createFilter(include, exclude);
  const postfixRE = /[?#].*$/s;
  let config: ResolvedConfig;

  return {
    name: "vite-plugin-cssvg",
    enforce: "pre",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async load(id) {
      if (!filter(id)) return;
      const filePath = id.replace(postfixRE, "");
      const code = await fs.promises.readFile(filePath, "utf8");
      const replaceMatch = code.match(/url\("?'?.*\.svg"?'?\)/g);
      if (replaceMatch) {
        let newCode = code;
        for (let index = 0; index < replaceMatch.length; index++) {
          const replaceMatchUrl = replaceMatch[index];

          const svgUrlMatch = replaceMatchUrl.match(/[^(url\("?'?)].*\.svg/g);
          if (!svgUrlMatch) continue;
          let svgUrl = svgUrlMatch[0];

          const resolveSourcce = await this.resolve(svgUrl, id);
          let svgData = replaceMatchUrl;
          if (!resolveSourcce) continue;
          try {
            const svg = fs.readFileSync(resolveSourcce.id, "utf-8");

            if (svg.length < 1024 * inlineLimit) {
              svgData = svg;
              newCode = newCode.replace(
                replaceMatchUrl,
                `url('data:image/svg+xml;utf8,${encodeURIComponent(
                  svgData.replace(/\t|\n|\v|\r|\f/g, "")
                )}')`
              );
            } else {
              continue;
            }
          } catch (error) {
            console.log(error);
            continue;
          }
        }
        return {
          code: newCode,
          map: null,
        };
      }
    },
  };
}
