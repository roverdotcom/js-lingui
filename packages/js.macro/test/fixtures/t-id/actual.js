import { setupI18n } from '@lingui/core'
import { t } from '@lingui/js.macro'

const i18n = setupI18n();

t.id("id")`Default message`;
t.id("id", "description")`Default message`;
t.id("id", {
  description: "description",
  type: "js",
})`Default message`;
