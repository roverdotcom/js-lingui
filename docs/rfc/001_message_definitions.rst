************************
RFC - Message Definition
************************

Proposal for a new ``@lingui/core`` message API using Babel macros released in 3.0.

Background
==========

`jsLingui`_ aims to support both common use cases:

1. messages which are also used as an ID
2. messages with custom IDs

Metadata
--------

Each message might contain additional medatata::

   type Metadata = string | Object

If ``Metadata`` is a string, it's a bascially message description. These two examples
are equivalent::

   t("help for translators")`Default message`

   t({ description: "help for translators" })`Default message`

Passing an object as ``Metadata`` allows developer to annotate message with additional
data::

   t({
      description: "help for translators",
      style: "informal"
   })`Default message`

Problem 1 - distinguish metadata and id
---------------------------------------

Until now, the first argument of `i18n.t` was a message ID::

   i18n.t("id")`Default message`

After adding an optional metadata, this use case would clash with metadata passed as
string::

   i18n.t("id or help text")`Default message`

Problem 2 - workflow with custom IDs
------------------------------------

If using custom message IDs, we define default message and help text just once and then
use an ID everywhere else::

   // Define
   i18n.t("message.id")`Default message with ${param}`

   // Use
   i18n._("message.id", { param })

Common workflow is define all messages in one place either globally or locally on the
top of the file and then use identifiers instead of strings::

   // Define
   const message = i18Mark("Default message with {param}")
   //                       ^- not possible to use macros here

   // Use
   i18n._(message, { param })

Solution
========

Messages used as IDs
--------------------

This use case is trivial as all we need to do is wrap a message in ``t`` template
tag::

   // Macro
   t`Default message`

   // Converted to
   i18n._("Defaut message")

With variables::

   // Macro
   t`Default message with ${param}`

   // Converted to
   i18n._("Defaut message with {param}", { param })

First (and only) argument passed to ``t`` macro will become message metadata::

   // Macro
   t("help text")`Default message`

   // In production, it's converted to
   i18n._("Defaut message")

   // In development, it's converted to
   i18n._("Defaut message", {}, { description: "help text" })

Lazy translations
~~~~~~~~~~~~~~~~~

The only complications are lazy translations - when we need to define a message, but
translate it later. This was previously achieved using ``i18Mark``, now it'll be
replaced with ``t.lazy`` macro::

   const msg = t.lazy`Default message`

   // In production it becomes
   const msg = "Default message"

   // In development it becomes
   const msg = define("Default message")

   // later we can use it with i18n._
   i18n._(msg)

   // Consider this real world example:
   const languages = {
      en: t.lazy`English`,
      cs: t.lazy`Czech`,
      fr: t.lazy`French`,
   }
   console.log(Object.keys(languages).map(key => i18n._(key))

This is very similar to ``define`` for projects using custom IDs described below.
The only difference is that ``t.lazy`` doesn't accept message ID as a first argument
and it can be used only in projects using messages as IDs.

Messages with custom IDs
------------------------

Let's enforce a workflow with two stages: 1) definition and 2) usage.

Definition
~~~~~~~~~~

Messages are defined using macros ``define`` and ``defineMessages``::

   // Define a single message
   // Two arguments: id and default message
   define("id", `Default message`)
   // Three arguments: id, metadata and default message
   define("id", "help text", `Default message`)
   define(
      "id",
      { description: "help text" },
      `Default message`
   )

   // Define a group of messages
   // Object key becomes message ID
   const messages = defineMessages({
      id: t("help text")`Default message`
   }

Both ``define`` and ``defineMessages`` are macros::

   const msg = define("id", "help text", `Default message`)
                                         ^- it's possible to use macros here

   // In production it becomes
   const msg = "id"

   // In development it becomes
   const msg = define("id", { defaults: "Default message, description: "help text" })

 ``defineMessages`` are similar::

   const messages = defineMessages({
      id: t("help text")`Default message`
   }

   // In production it becomes
   const messages = {
      id: "id"
   }
   // In development it becomes
   const messages = {
      id: define("id", { defaults: "Default message", description: "help text" })
   }

Variables in definitions
~~~~~~~~~~~~~~~~~~~~~~~~

Because these messages are defined in different scope, we don't have access
to variables inside messages (if any)::

   const msg = define("id", `Message with ${variable}`)
                                           ^- does not exist in this scope probably

Let's add another macro, `arg`::

   const msg = define("id", `Message with ${arg('variable')}`)

This may seem unnecessary for simple messages as we could simplify it to::

   const msg = define("id", `Message with {variable}`)

But using ``arg`` macro, we can use other i18n macros, like ``plural``::

   const msg = define("id", plural({
      value: arg("variable"),
      one: "# book",
      other: "# books",
   }))

Instead of writing this syntax manually::

   const msg = define("id", "{variable, plural, one {# book} other {# books}}")

Usage
~~~~~

Defined messages are passed to core i18n method ``i18n._``::

   const msg = define("id", "help text", "Default message")
   i18n._(msg)

   // Parameters *must* be passed manually
   const msg = define("id", "help text", `Default message with ${arg("param")}`)
   i18n._(msg, { param })

   const messages = defineMessages({
      id: t("help text")`Default message`
   }
   i18n._(msg.id)

TODO
~~~~

What if I want to define and use the message in one place?

::

   // pass output of define macro to i18n._?
   i18n._(define("id", "help text", "default message"))

   // _ macro, which is converted to i18n._?
   _("id", "help text", "default message")

Summary
=======

The API solves following issues:

- `#197 <https://github.com/lingui/js-lingui/issues/197>`_ - Add metadata to messages
- `#258 <https://github.com/lingui/js-lingui/issues/197>`_ - i18Mark should accept default value

In #258, OP is creating a catalog of common translations. This will be solved using
``defineMessages``.

``i18Mark`` will become obsolete in favor of ``t.lazy``, ``define`` and ``defineMessages``.
