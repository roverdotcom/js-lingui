****************************************************
@lingui/react.macro - Babel macros for @lingui/react
****************************************************

``react.macro`` is a `babel macro <babel-plugin-macros>`_ which transforms React
components into messages in ICU MessageFormat. This package is completely optional,
but it's convenient way to write MessageFormat syntax using React components.

Overview
========

All macros are transformed to :component:`Trans` component from
:doc:`@lingui/react <react>`. Here are some examples of `message format syntax <message-format>`_:

+-------------------------------------------------------------+--------------------------------------------------------------------+
| Macro                                                       | Result                                                             |
+=============================================================+====================================================================+
| ``<Trans>Refresh inbox</Trans>``                            | ``<Trans id="Refresh inbox" />``                                   |
+-------------------------------------------------------------+--------------------------------------------------------------------+
| ``<Trans id="msg.refresh">Refresh inbox</Trans>``           | ``<Trans id="msg.refresh" defaults="Refresh inbox" />``            |
+-------------------------------------------------------------+--------------------------------------------------------------------+
| ``<Trans>Attachment {name} saved</Trans>``                  | ``<Trans id="Attachment {name} saved" />``                         |
+-------------------------------------------------------------+--------------------------------------------------------------------+
| ``<Plural value={count} one="Message" other="Messages" />`` | ``<Trans id="{value, plural, one {Message} other {Messages}}" />`` |
+-------------------------------------------------------------+--------------------------------------------------------------------+
| ``<Trans>Today is <DateFormat value={today} /></Trans>``    | ``<Trans id="Today is {today, date}" />``                          |
+-------------------------------------------------------------+--------------------------------------------------------------------+

In short, MessageFormat syntax is generated from children of :reactmacro:`Trans` macro
and props of :reactmacro:`Plural`, :reactmacro:`Select` and :reactmacro:`SelectOrdinal`.
This message is used as a message ID in catalog, but can be overriden by custom ID.
Generated message is guaranteed to be syntactically valid.

Installation
============

``react.macro`` requires babel-plugin-macros_ to work:

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

3. Install ``@lingui/react.macro`` as a development dependency::

      yarn add --dev @lingui/react.macro
      # npm install --save-dev @lingui/react.macro

Reference
=========

Common props
------------

All macros share following props:

id
^^

Each message in catalog is identified by **message ID**.

While all macros use generated message as the ID, it's possible to override it.
In such case, generated message is used as a default translation.

.. code-block:: jsx

   import { Trans } from "@lingui/react.macro"

   <Trans id="message.attachment_saved">Attachment {name} saved.</Trans>

   // This is transformed to:
   // <Trans id="message.attachment_saved" defaults="Attachment {name} saved." />

render
^^^^^^

Custom component to render translation into. This prop is directly passed to
:component:`Trans` component from :doc:`@lingui/react <react>`. See
`rendering of translations <rendering-translations>`_ for more info.

Trans
-----

.. reactmacro:: Trans

   :prop string id: Custom message ID

:reactmacro:`Trans` is the basic macro for static messages, messages with variables,
but also for messages with inline markup.

.. code-block:: jsx

   import { Trans } from "@lingui/react.macro"

   <Trans>Refresh inbox</Trans>;
   <Trans id="message.attachment_saved">Attachment {name} saved.</Trans>

This macro is especially useful when message contains inline markup.

.. code-block:: jsx

   import { Trans } from "@lingui/react.macro"

   <Trans>Read the <a href="/docs">docs</a>.</Trans>;

   // This is transformed to:
   // <Trans id="Read the <0>docs</0>." components={[<a href="/docs" />]} />

Components and HTML tags are replaced with dummy indexed tags (``<0></0>``) which
has several advatanges:

- both custom React components and built-in HTML tags are supported
- change of component props doesn't break the translation
- the message is extracted as a whole sentence (this seems to be obvious, but most
  i18n libs simply split message into pieces by tags and translate them separately)

Plural
------

.. reactmacro:: Plural

   :prop number value: (required) Value is mapped to plural form below
   :prop string|Object format:  Number format passed as options to `Intl.NumberFormat`_
   :prop number offset: Offset of value when calculating plural forms
   :prop string zero: Form for empty ``value``
   :prop string one: *Singular* form
   :prop string two: *Dual* form
   :prop string few: *Paucal* form
   :prop string many: *Plural* form
   :prop string other: (required) general *plural* form
   :prop string _<number>: Exact match form, corresponds to ``=N`` rule

Props of :reactmacro:`Plural` macro are transformed into :icu:`plural` format.

.. code-block:: jsx

   import { Plural } from "@lingui/react.macro"

   <Plural value={numBooks} one="Book" other="Books" />

   // This is transformed to:
   // <Trans id="{numBooks, plural, one {Book} other {Books}}" />

``#`` are formatted using :icu:`number` format. ``format`` prop is passed to this
formatter.

Exact matches in MessageFormat syntax are expressed as ``=<number>`` (e.g. ``=0``),
but in React this isn't a valid prop name. Therefore, exact matches are expressed as
``_<number>`` prop (e.g. ``_0). This is commonly used in combination with
``offset`` prop. ``offset`` affects only plural forms, not exact matches.

.. code-block:: jsx

   import { Plural } from "@lingui/react.macro"

   const count = 42;
   <Plural
       value={count}
       offset={1}
       // when value == 0
       _0="Nobody arrived"

       // when value == 1
       _1="Only you arrived"

       // when value == 2
       // value - offset = 1 -> `one` plural form
       one="You and # other guest arrived"

       // when value >= 3
       other="You and # other guests arrived"
   />

   // This is transformed to Trans component with ID:
   // {count, plural, _0    {Nobody arrived}
   //                 _1    {Only you arrived}
   //                 one   {You and # other guest arrived}
   //                 other {You and # other guests arrived}}

Select
------

.. reactmacro:: Select

   :prop number value: (required) Value determines which form is outputted
   :prop number other: (required) Default, catch-all form

Props of :reactmacro:`Select` macro are transformed into :icu:`select` format:

.. code-block:: jsx

   import { Select } from "@lingui/react.macro"

   // gender == "female"      -> Her book
   // gender == "male"        -> His book
   // gender == "unspecified" -> Their book
   <Select
       value={gender}
       male="His book"
       female="Her book"
       other="Their book"
   />;

SelectOrdinal
-------------

.. reactmacro:: SelectOrdinal

   :prop number value: (required) Value is mapped to plural form below
   :prop number offset: Offset of value for plural forms
   :prop string zero: Form for empty ``value``
   :prop string one: *Singular* form
   :prop string two: *Dual* form
   :prop string few: *Paucal* form
   :prop string many: *Plural* form
   :prop string other: (required) general *plural* form
   :prop string _<number>: Exact match form, correspond to ``=N`` rule. (e.g: ``_0``, ``_1``)
   :prop string|Object format:  Number format passed as options to `Intl.NumberFormat`_

   MessageFormat: ``{arg, selectordinal, ...forms}``

Props of :reactmacro:`SelectOrdinal` macro are transformed into :icu:`selectOrdinal`
format:

.. code-block:: jsx

   import { SelectOrdinal } from "@lingui/react.macro"

   // count == 1 -> 1st
   // count == 2 -> 2nd
   // count == 3 -> 3rd
   // count == 4 -> 4th
   <SelectOrdinal
       value={count}
       one="1st"
       two="2nd"
       few="3rd"
       other="#th"
   />

DateFormat
----------

.. reactmacro:: DateFormat

   :prop string|Date value: (required) date to be formatted
   :prop string|Object format: date format passed as options to `Intl.DateTimeFormat`_

:reactmacro:`DateFormat` macro is transformed into :icu:`date` format.

.. code-block:: jsx

   // date as a string
   <DateFormat value="2018-07-23" />;

   const now = new Date();
   // default language format
   <DateFormat value={now} />;

   const now = new Date();
   // custom format
   <DateFormat value={now} format={{
       year: "numeric",
       month: "long",
       day: "numeric"
   }} />;

.. note::

   Standalone :reactmacro:`DateFormat` is transformed to :component:`DateFormat`
   which is evaluated directly. It's never transformed to ``{value, date}`` message,
   because such message can't be translated.

NumberFormat
------------

.. reactmacro:: NumberFormat

   :prop number value: (required) Number to be formatted
   :prop string|Object format: Number format passed as options to `Intl.NumberFormat`_

:reactmacro:`NumberFormat` macro is transformed into :icu:`number` format.

.. code-block:: jsx

   const num = 0.42;
   // default language format
   <NumberFormat value={num} />;

   const amount = 3.14;
   // custom format
   <NumberFormat value={amount} format={{
       style: 'currency',
       currency: 'EUR',
       minimumFractionDigits: 2
   }} />;

.. _babel-plugin-macros: https://github.com/kentcdodds/babel-plugin-macros
.. _Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
.. _Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
