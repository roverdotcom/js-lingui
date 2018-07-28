.. _message-format:

*****************
ICU MessageFormat
*****************

ICU MessageFormat is a flexible yet powerful syntax to express all nuances of grammar
for each language.

Overview
--------

+------------------+------------------------------------------------------------------+
| Format           + Example                                                          |
+==================+==================================================================+
| Simple text      | ``Refresh inbox``                                                |
+------------------+------------------------------------------------------------------+
| Variables        | ``Attachment {name} saved``                                      |
+------------------+------------------------------------------------------------------+
| Plurals          | - Using language specific plural forms (``one``, ``other``)::    |
|                  |                                                                  |
|                  |     {count, plural, one {Message} other {Messages}}              |
|                  |                                                                  |
|                  | - Using exact matches (``=0``):                                  |
|                  |                                                                  |
|                  |   .. code-block:: none                                           |
|                  |                                                                  |
|                  |     {count, plural, =0 {No messages}                             |
|                  |                     one {# message}                              |
|                  |                     other {# messages}}                          |
|                  |                                                                  |
|                  | - Offseting plural form:                                         |
|                  |                                                                  |
|                  |   .. code-block:: none                                           |
|                  |                                                                  |
|                  |      {count, plural, offset:1                                    |
|                  |                      =0 {Nobody read this message}               |
|                  |                      =1 {Only you read this message}             |
|                  |                      one {You and # friend read this message}    |
|                  |                      other {You and # friends read this message} |
+------------------+------------------------------------------------------------------+
| .. icu:: select  | .. code-block:: none                                             |
|                  |                                                                  |
| Select           |    {gender, select, male {He replied to your message}            |
|                  |                     female {She replied to your message}         |
|                  |                     other {They replied to your message}}        |
+------------------+------------------------------------------------------------------+
| .. icu:: ordinal | .. code-block:: none                                             |
|                  |                                                                  |
| Ordinals         |    {count, selectOrdinal, one {1st message}                      |
|                  |                           two {2nd message}                      |
|                  |                           few {3rd message}                      |
|                  |                           other {#th message}}                   |
+------------------+------------------------------------------------------------------+
| .. icu:: number  | .. code-block:: none                                             |
|                  |                                                                  |
| Numbers          |    You're using {size, number, percent} of you quota             |
+------------------+------------------------------------------------------------------+
| .. icu:: date    | .. code-block:: none                                             |
|                  |                                                                  |
| Dates            |    Today is {today, date}                                        |
+------------------+------------------------------------------------------------------+

Available formats
-----------------

.. icu:: plural

plural
^^^^^^

This format is used to choose output based on the pluralization rules of the active
language::

   {count, plural, one {Message} other {Messages}}

As a developer you only need to know plural rules for the language
used in source code. For example for English it's only ``one`` and ``other``.
Plural forms for all other languages can be found at `CLDR Plural Rules`_ page.

``other`` plural form is also used when a specific plural form isn't defined.

.. warning::

   Not all languages use ``zero`` plural form! English, for example, uses
   ``other`` form when ``value == 0`` (e.g: 1 book, but 0 books). Use ``_<number>``
   form if you want to match zero (e.g: ``_0``)::

   {count, plural, zero {No messages} one {# message} other {# messages}}

``#`` character inside message is used as a placeholder for ``value``. When ``offset``
is used, the ``#`` is replaced with ``value - offset``.

``#`` is always formatted as a number. It's a shortcut for ``{count, number}`` .

select
^^^^^^

This format is used to choose output based on the ``value``.

``other`` prop is used when no prop matches ``value``::

   {gender, select, male   {He replied to your message}
                    female {She replied to your message}
                    other  {They replied to your message}}

selectOrdinal
^^^^^^^^^^^^^

This format is similar to :icu:`plural`. The only difference is that it uses
**ordinal** plural forms, instead of **cardinal** ones::

   {count, selectOrdinal, one {1st message}
                          two {2nd message}
                          few {3rd message}
                          other {#th message}}

date
^^^^

This format takes a date object or a date string and formats it
using `Intl.DateTimeFormat`_::

   Today is {today, date}

number
^^^^^^

This format takes a number and formats it using  `Intl.NumberFormat`_::

   You're using {size, number, percent} of you quota.

.. _Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
.. _Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
