import React from 'react'
import 'bootstrap3/dist/js/npm'
import 'bootstrap3/dist/css/bootstrap.css'

const App = () => {
  return (
    <>
      <div className="navbar navbar-default" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <a className="navbar-brand page-title" href="#">
              <span>Swarm Simulator</span>
            </a>
            <a className="envalert navbar-brand">Eenv.name</a>
            <a className="navbar-brand">
              <span className="text-muted small">Vversion</span>
            </a>
          </div>
          <div className="navbar-right"></div>
        </div>
      </div>
      <div className="alert alert-danger alert-dismissible animif" role="alert">
        <button type="button" className="close" data-dismiss="alert">
          <span aria-hidden="true">&times;</span>
          <span className="sr-only">Close</span>
        </button>
        <p>
          Oh no! There was a problem loading your saved game.{' '}
          <b>This is a bug.</b>
        </p>
        <p>
          Here's your saved game data. <b>Save this</b>: once the bug is fixed,
          you can import this to restore your game.
        </p>
        <input type="text" className="form-control" readOnly />
        <p>
          The error message was: <code></code>
        </p>
        <p>
          Please <a>report this bug</a>. Thanks!
        </p>
      </div>
      <div
        className="alert alert-danger alert-dismissible animif"
        role="alert"
        ng-if="form.errored && !form.export"
      >
        <button type="button" className="close" data-dismiss="alert">
          <span aria-hidden="true">&times;</span>
          <span className="sr-only">Close</span>
        </button>
        <p>Oh no! There was a problem loading your saved game.</p>
        <p>
          <b>
            Please make sure <code>form.domain</code> has permission to set
            cookies/localstorage in your browser.
          </b>
        </p>
        <p ng-if="isKongregate()">
          This problem usually happens when your browser is{' '}
          <a
            href="https://www.google.com/search?q=how%20to%20enable%20third-party%20cookies"
            target="_blank"
          >
            blocking third-party cookies
          </a>
          . Swarm Simulator needs this storage to save your game. It's not doing
          anything evil, I promise.
        </p>
        <p>
          The error message was: <code>form.error</code>
        </p>
        <p>
          If you think this is a bug, you can{' '}
          <a ng-href="{{contactUrl()}}">report it</a>. Thanks!
        </p>
      </div>
      <div>
        <div
          className="alert alert-danger alert-dismissible animif"
          role="alert"
          ng-if="form.errored"
        >
          <button type="button" className="close" data-dismiss="alert">
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
          <p>Oh no! There was a problem saving your game.</p>
          <p>
            Here's the data we tried to save. You can import this through the{' '}
            <a href="#/options">options screen</a>.
          </p>
          <input
            type="text"
            className="form-control"
            ng-model="form.export"
            ng-click="select($event)"
          />
          <p>
            The error message was: <code>form error</code>
          </p>
        </div>
      </div>
      <div>
        <div
          id="welcomeback"
          className="alert alert-info alert-dismissible animif"
          role="alert"
          ng-if="showWelcomeBack"
        >
          <button type="button" className="close" data-dismiss="alert">
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
          <p>Welcome back! While you were away for your swarm produced:</p>
          <ul>
            <li>
              <a></a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div
          id="aprilfools-news"
          className="alert alert-info alert-dismissable animif"
          role="alert"
        >
          <button type="button" className="close" data-dismiss="alert">
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close</span>
          </button>
          <div>
            <span
              title="Really. Honest. Would I lie to you?"
              className="small pull-right"
            >
              year/04/01
            </span>
            <div>
              <p>
                <strong title="Really. Honest. Would I lie to you?">
                  Exciting changes are coming to Swarm Simulator soon!
                </strong>
              </p>
              <p>
                Insects are too icky, so we're changing our name. Also, we'll
                require graphics to play.
              </p>
              <p>
                <a>Try out the upcoming changes now!</a>
              </p>
            </div>
            <div>
              <p>
                <strong title="Really. Honest. Would I lie to you?">
                  Swarm Simulator is now Kitten Klicker!
                </strong>
              </p>
              <p>
                Insects were too icky, so we've changed our name. Also, we now
                require graphics to play. Thanks to{' '}
                <a
                  target="_blank"
                  href="http://placekitten.com/attribution.html"
                >
                  Placekitten
                </a>{' '}
                for providing graphics. Enjoy the new game!
              </p>
              <p>
                <a>Click here if you hate kittens, you monster.</a>
              </p>
            </div>
          </div>
          <div>
            <span className="small pull-right"></span>
            <p>I hope you enjoyed yesterday's April Fools joke!</p>
            <p>
              <a href="#/cleartheme?themeExtra=@import%20url%28'/static/kittens.css'%29;">
                Click here to keep the kitten pictures.
              </a>{' '}
              To remove them later, go to the options screen and click "Clear
              all extra styling/graphics".
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
