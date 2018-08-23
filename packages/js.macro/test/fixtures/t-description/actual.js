import { setupI18n } from '@lingui/core'
import { t } from '@lingui/js.macro'

const i18n = setupI18n();

t('description')`Default message`;
t({
  description: "description",
  type: "js"
})`Default message`;
