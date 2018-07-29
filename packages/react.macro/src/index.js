// @flow

import { createMacro } from "babel-plugin-macros"
import Transformer from "./transformer"

const importsToCarryOver = ["DateFormat", "NumberFormat"]

function index({ references, state, babel }) {
  const { types: t } = babel
  const transformer = new Transformer(babel)

  const toKeepImports = ["Trans"]

  for (let [tagName, tags] of Object.entries(references)) {
    if (importsToCarryOver.includes(tagName)) toKeepImports.push(tagName)

    tags.forEach(openingTag => {
      if (!t.isJSXOpeningElement(openingTag.container)) return // Exclude closing elements

      const node = openingTag.context.parentPath.container

      transformer.transform({ node }, state.file)
    })
  }

  const linguiReactImport = state.file.path.node.body.find(
    importNode =>
      t.isImportDeclaration(importNode) &&
      importNode.source.value === "@lingui/react"
  )

  // Handle adding the import or altering the existing import
  if (linguiReactImport) {
    toKeepImports.forEach(name => {
      if (
        linguiReactImport.specifiers.findIndex(
          specifier => specifier.imported && specifier.imported.name === name
        ) === -1
      ) {
        console.log(`Pushing ${name} to imports`)
        linguiReactImport.specifiers.push(
          t.importSpecifier(t.identifier(name), t.identifier(name))
        )
      }
    })
  } else {
    state.file.path.node.body.unshift(
      t.importDeclaration(
        toKeepImports.map(name =>
          t.importSpecifier(t.identifier(name), t.identifier(name))
        ),
        t.stringLiteral("@lingui/react")
      )
    )
  }

  console.log("Finished macro")
}

const Trans = () => {}
const Plural = () => {}
const Select = () => {}
const SelectOrdinal = () => {}
const DateFormat = () => {}
const NumberFormat = () => {}

type PluralProps = {
  value: number | string,
  offset?: number | string,
  zero?: any,
  one?: any,
  two?: any,
  few?: any,
  many?: any,
  other: any,
  locales?: Locales
} & RenderProps

type SelectProps = {
  value: any,
  other: any
} & RenderProps

export default createMacro(index)
export { Trans, Plural, Select, SelectOrdinal, DateFormat, NumberFormat }
