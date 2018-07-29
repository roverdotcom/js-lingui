import { t, plural } from "@lingui/js.macro"
import { Trans } from "@lingui/react.macro"

const i18n = setupI18n()

;<Trans>Hi, my name is {name}</Trans>
;<span title={t`Title`} />
;<span
  title={plural({
    value: count,
    one: "# book",
    other: "# books"
  })}
/>

const a = t`Title`
t`Title`

const p = plural({
  value: count,
  one: "# book",
  other: "# books"
})
plural({
  value: count,
  one: "# book",
  other: "# books"
})
