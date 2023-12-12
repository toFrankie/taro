import BaseParser from './base'

export default class RenderParser extends BaseParser {
  constructor (
    protected template: Map<string, string>
  ) {
    super()
  }

  generate () {
    const renderContent = `import TaroIcon from './icon'
import TaroText from './text'
import TaroView from './view'
import TaroLabel from './label'
import TaroInput from './input'
import TaroImage from './image'
import { TaroSwiper, TaroSwiperItem } from './swiper'
import TaroButton from './button'
import TaroSlider from './slider'
import TaroSwitch from './switch'
import TaroTextArea from './textArea'
import TaroRichText from './richText'
import TaroInnerHtml from './innerHtml'
import TaroScrollView from './scrollView'
import { TaroRadio, TaroRadioGroup } from './radio'
import { TaroCheckboxGroup, TaroCheckbox } from './checkbox'
import TaroPicker from './picker'
import TaroVideo from './video'
import TaroForm from './form'
import { NodeType, TaroElement as TaroOldElement } from '../runtime'
import { TaroElement, TaroImageElement, TaroTextElement } from '../runtime/ets/element'
${this.generateRenderImport()}
import type { TaroViewElement } from '../runtime/ets/element'

import type {
  TaroCheckboxElement,
  TaroFormElement,
  TaroIconElement,
  TaroLabelElement, 
  TaroPickerElement, 
  TaroRadioElement,
  TaroRichTextElement,
  TaroRadioGroupElement, 
  TaroInputElement, 
  TaroCheckboxGroupElement,
  TaroTextAreaElement,
  TaroVideoElement,
  TaroSwiperItemElement,
  TaroSwiperElement,
  TaroSwitchElement,
  TaroSliderElement,
  TaroScrollViewElement,
  TaroButtonElement
} from './element'

@Builder
function createNode (node: TaroOldElement | TaroElement) {
  if (node instanceof TaroOldElement) {
    ${this.generateRenderCondition()}if (node.tagName === 'BUTTON') {
      TaroButton({ node: node as TaroButtonElement })
    } else if (node.tagName === 'SCROLL-VIEW') {
      TaroScrollView({ node: node as TaroScrollViewElement })
    } else if (node.tagName === 'SLIDER') {
      TaroSlider({ node: node as TaroSliderElement })
    } else if (node.tagName === 'SWITCH') {
      TaroSwitch({ node: node as TaroSwitchElement })
    } else if (node.tagName === 'INPUT') {
      TaroInput({ node: node as TaroInputElement })
    } else if (node.tagName === 'SWIPER') {
      TaroSwiper({ node: node as  TaroSwiperElement })
    } else if (node.tagName === 'SWIPER-ITEM') {
      TaroSwiperItem({ node: node as  TaroSwiperItemElement })
    } else if (node.tagName === 'INNER-HTML') {
      TaroInnerHtml({ node })
    } else if (node.tagName === 'RICH-TEXT') {
      TaroRichText({ node: node as  TaroRichTextElement })
    } else if (node.tagName === 'ICON') {
      TaroIcon({ node: node as  TaroIconElement })
    } else if (node.tagName === 'TEXTAREA') {
      TaroTextArea({ node: node as  TaroTextAreaElement })
    } else if (node.tagName === 'CHECKBOX-GROUP') {
      TaroCheckboxGroup({ node: node as TaroCheckboxGroupElement })
    } else if (node.tagName === 'CHECKBOX') {
      TaroCheckbox({ node: node as  TaroCheckboxElement })
    } else if (node.tagName === 'RADIO-GROUP') {
      TaroRadioGroup({ node: node as TaroRadioGroupElement })
    } else if (node.tagName === 'RADIO') {
      TaroRadio({ node: node as  TaroRadioElement })
    } else if (node.tagName === 'LABEL') {
      TaroLabel({ node: node as  TaroLabelElement })
    } else if (node.tagName === 'PICKER') {
      TaroPicker({ node: node as  TaroPickerElement })
    } else if (node.tagName === 'FORM') {
      TaroForm({ node: node as  TaroFormElement })
    } else if (node.tagName === 'VIDEO') {
      TaroVideo({ node: node as TaroVideoElement })
    }
  } else {
    LazyForEach(node, (item: TaroElement) => {
      if (item.tagName === 'VIEW') {
        TaroView(item as TaroViewElement)
      } else if (item.tagName === 'TEXT' || item.nodeType === NodeType.TEXT_NODE) {
        TaroText(item as TaroTextElement)
      } else if (item.tagName === 'IMAGE') {
        TaroImage(item as TaroImageElement)
      } else {
        TaroView(item as TaroViewElement)
      }
    }, (item: TaroElement) => item._nid)
  }
}

export { createNode }
`

    return renderContent
  }

  generateRenderImport () {
    let result = ''

    this.template.forEach((_, key) => {
      result = `${result}import ${key} from './static/${key}'\n`
    })

    return result
  }

  generateRenderCondition () {
    let result = ''
    
    this.template.forEach((_, key) => {
      const keyData = key.split('_')
      const name = keyData[keyData.length - 1]
      result = `${result}if (node._attrs?.compileMode === '${name}') {
    ${key}({ node: node as TaroViewElement })
  } else `
    })

    return result
  }
}