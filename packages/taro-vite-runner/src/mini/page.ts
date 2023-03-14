import { appendVirtualModulePrefix, getCompiler, prettyPrintJson, stripVirtualModulePrefix } from '../utils'

import type { PluginOption } from 'vite'

const PAGE_SUFFIX = '?page-loader=true'

export default function (): PluginOption {
  return {
    name: 'taro:vite-mini-page',
    enforce: 'pre',
    resolveId (source, _importer, options) {
      const compiler = getCompiler(this)
      if (compiler?.isPage(source) && options.isEntry) {
        return appendVirtualModulePrefix(source + PAGE_SUFFIX)
      }
      return null
    },
    load (id) {
      const compiler = getCompiler(this)
      if (compiler && id.endsWith(PAGE_SUFFIX)) {
        const rawId = stripVirtualModulePrefix(id).replace(PAGE_SUFFIX, '')
        const page = compiler.getPageById(rawId)

        if (!page) {
          compiler.logger.warn(`编译页面 ${rawId} 失败!`)
          process.exit(1)
        }

        const pageConfig = prettyPrintJson(page.config)

        let instantiatePage = `var inst = Page(createPageConfig(component, '${page.name}', {root:{cn:[]}}, config || {}))`

        if (typeof compiler.loaderMeta.modifyInstantiate === 'function') {
          instantiatePage = compiler.loaderMeta.modifyInstantiate(instantiatePage, 'page')
        }

        return [
          'import { createPageConfig } from "@tarojs/runtime"',
          `import component from "${rawId}"`,
          `var config = ${pageConfig}`,
          page.config.enableShareTimeline ? 'component.enableShareTimeline = true' : '',
          page.config.enableShareAppMessage ? 'component.enableShareAppMessage = true' : '',
          instantiatePage,
        ].join('\n')
      }
    }
  }
}