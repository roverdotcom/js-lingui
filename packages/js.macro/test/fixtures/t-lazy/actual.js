import { setupI18n } from '@lingui/core'
import { t, arg } from '@lingui/js.macro'

const i18n = setupI18n();

t.lazy`Default message`;
t.lazy("description)`Default message`;
t.id.lazy("id")`Default message`;
t.id.lazy("id", "description")`Default message`;

t.lazy`With argument ${arg('argument')}`;
