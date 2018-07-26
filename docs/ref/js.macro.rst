js.macro - API Reference
========================

``js.macro`` is a `babel macro <babel-plugin-macros>`_ which transforms texts written usign tagged
template strings and i18n methods into messages in ICU MessageFormat.

Installation
------------

Babel macros require babel-plugin-macros_ to work:

1. Install ``babel-plugin-macros`` as a development dependency::

      yarn add --dev babel-plugin-macros
      # npm install --save-dev babel-plugin-macros

2. Add ``macros`` to the top of plugins section in your Babel config.

   .. code-block:: json

      {
         plugins: [
            "macros"
         ]
      }

3. Install ``@lingui/js.macro`` as a development dependency::

      yarn add --dev @lingui/js.macro
      # npm install --save-dev @lingui/js.macro

Usage
-----

.. important:: ``i18n`` object must be in scope.

   In JavaScript you get ``i18n`` object by calling :js:func:`setupI18n` from
   ``@lingui/core`` package:

   .. code-block:: jsx

      import { setupI18n } from "@lingui/core"

      const i18n = setupI18n()

   In React you should use ``i18n`` prop injected by :component:`withI18n` HOC:

   .. code-block:: jsx

      import { withI18n } from "@lingui/react"

      const Component = withI18n()(({ i18n }) => {
         // i18n is in scope
      })

General translation
^^^^^^^^^^^^^^^^^^^

.. macro:: t

The most common macro for messages. It transforms tagged template string into message
in ICU MessageFormat. It's allowed to use other i18n macros as variables.

.. code-block:: jsx

   import { setupI18n } from "@lingui/core"
   import { t } from "@lingui/js.macro"

   // Reminder: i18n must be in scope
   const i18n = setupI18n()

   // Static Message
   const static = t`Static Message`

   // My name is {name}
   const vars = t`My name is ${name}`

   // Macros can be nested, date is macro for date formatting
   const date = t`Today is ${date(name)}`

.. code-block:: jsx

   // Override auto-generated message ID
   const id = t('msg.id')`My name is ${name}`

Call macro with custom message ID to override auto-generated one.

Pluralization
^^^^^^^^^^^^^^

.. macro:: plural

``plural`` macro is used for pluralization, e.g: messages which has different form
based on counter. It accepts an object with required key ``value`` which determines
the plural form. The only required plural form is a catch-all ``other``. Other forms
depends on source language you're using (e.g: English has ``one`` and ``other`` plural
forms).

.. code-block:: jsx

   import { setupI18n } from "@lingui/core"
   import { plural } from "@lingui/js.macro"

   // Reminder: i18n must be in scope
   const i18n = setupI18n()

   const msg = plural({
      value: count,
      one: "# Book",
      other: "# Books"
   })

   // t macro isn't required for messages,
   // template strings are transformed automatically.
   const vars = plural({
      value: count,
      one: `${name} has # friend`,
      other: `${name} has # friends`
   })

   // Example of pluralization using two counters
   const double = plural({
      value: numBooks,
      one: plural({
         value: numArticles,
         one: `1 book and 1 article`,
         other: `1 book and ${numArticles} articles`,
      }),
      other: plural({
         value: numArticles,
         one: `${numBooks} books and 1 article`,
         other: `${numBooks} books and ${numArticles} articles`,
      }),
   })

Call macro with a string as a first argument to override auto-generated message ID.

.. code-block:: jsx

   // Override auto-generated message ID
   const id = plural("msg.id", {
      value: count,
      one: "# Book",
      other: "# Books"
   })

Date formatting
^^^^^^^^^^^^^^^

.. macro:: date

This macro marks variable as a date which is formatted using `Intl.DateTimeFormat`_.

First parameter is a value to be formatted.

Second argument (optional) specifies date format.

.. code-block:: jsx

   import { setupI18n } from "@lingui/core"
   import { t, date } from "@lingui/js.macro"

   // Reminder: i18n must be in scope
   const i18n = setupI18n()

   const today = new Date()
   const msg = t`Today is ${date(today)}.`

Number formatting
^^^^^^^^^^^^^^^^^

.. macro:: number

This macro marks variable as a number which is formatted using `Intl.NumberFormat`_.

First parameter is a value to be formatted.

Second argument (optional) specifies number format.

.. code-block:: jsx

   import { setupI18n } from "@lingui/core"
   import { t, number } from "@lingui/js.macro"

   // Reminder: i18n must be in scope
   const i18n = setupI18n()

   const msg = t`There were ${number(10000)} people.`
   const percent = t`Interest rate is ${number(0.05, "percent")}.`


.. _babel-plugin-macros: https://github.com/kentcdodds/babel-plugin-macros
.. _Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
.. _Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
