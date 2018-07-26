react.macro - API Reference
========================

``react.macro`` is a `babel macro <babel-plugin-macros>`_ which transforms React
components into messages in ICU MessageFormat.

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

3. Install ``@lingui/react.macro`` as a development dependency::

      yarn add --dev @lingui/react.macro
      # npm install --save-dev @lingui/react.macro


.. _babel-plugin-macros: https://github.com/kentcdodds/babel-plugin-macros
.. _Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
.. _Intl.NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
