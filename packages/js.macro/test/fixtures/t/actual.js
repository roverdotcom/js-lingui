import { setupI18n } from '@lingui/core'
import { t } from '@lingui/js.macro'

const i18n = setupI18n();

const a = t`Expression assignment`;
t`Variable ${name}`;
t`${duplicate} variable ${duplicate}`;

t`
  Property ${props.name},
  function ${random()},
  array ${array[index]},
  constant ${42},
  object ${new Date()}
  anything ${props.messages[index].value()}
`
