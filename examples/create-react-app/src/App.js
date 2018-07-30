import React, { Component } from "react"
import { Trans } from "@lingui/react.macro"
import { t } from "@lingui/js.macro"
import { I18nProvider } from "@lingui/react"
import logo from "./logo.svg"
import "./App.css"

import csMessages from "./locale/cs/messages.js"
import enMessages from "./locale/en/messages.js"

const i18n = {}

class App extends Component {
  state = { language: "en" }

  handleLanguage(language) {
    this.setState({ language })
  }
  render() {
    return (
      <I18nProvider
        language={this.state.language}
        catalogs={{ cs: csMessages, en: enMessages }}
      >
        <div className="App">
          <header className="App-header">
            <img
              src={logo}
              className="App-logo"
              alt={t("App.logo.alt")`Logo of React project`}
            />
            <h1 className="App-title">
              <Trans id="App.title">Welcome to React</Trans>
            </h1>
          </header>
          <p className="App-intro">
            <Trans id="App.intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </Trans>
          </p>
          <p>
            <button onClick={() => this.handleLanguage("en")}>English</button>
            <button onClick={() => this.handleLanguage("cs")}>Česky</button>
          </p>
        </div>
      </I18nProvider>
    )
  }
}

export default App
