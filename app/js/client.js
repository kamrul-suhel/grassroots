import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import { Router, browserHistory, useRouterHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import store from './common/store'
import routes from './common/routes'

const history = syncHistoryWithStore(browserHistory, store)
const app = document.getElementById('app')

ReactDOM.render((
	<Provider store={store}>
		<Router history={history} routes={routes} />
	</Provider>
), app);

if (!process.env.NODE_ENV || (process.env.NODE_ENV && process.env.NODE_ENV !== 'production')) {
	if (module.hot) {
		module.hot.accept();
		ReactDOM.render((
			<AppContainer>
				<Provider store={store} key={Math.random()}>
					<Router history={history} routes={routes} />
				</Provider>
			</AppContainer>
		), app);
	}
}