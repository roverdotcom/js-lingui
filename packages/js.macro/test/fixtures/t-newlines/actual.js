import { setupI18n } from '@lingui/core'
import { t } from '@lingui/js.macro'

const i18n = setupI18n();

t`
  Remove any newlines...
  
  and replace them with one space.
`;
t`
  Remove any newlines... \
  and replace them with one space.
`;
