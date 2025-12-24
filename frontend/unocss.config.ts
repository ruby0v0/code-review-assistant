import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [presetIcons(), presetWind3(), presetAttributify()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
