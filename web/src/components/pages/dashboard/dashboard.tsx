import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { UserClient } from '../../../../../common/user-clients';
import StateTree from '../../../stores/tree';
import ProgressBox from './progress-box';

import './dashboard.css';

interface PropsFromState {
  account: UserClient;
}

interface Props extends PropsFromState {}

interface State {
  locale: string;
  showTitleBarLocales: boolean;
}

const TITLE_BAR_LOCALE_COUNT = 3;

class Dashboard extends React.Component<Props, State> {
  state: State = { locale: 'all-languages', showTitleBarLocales: true };

  componentDidMount() {
    window.addEventListener('resize', this.checkShowTitleBarLocales);
    this.checkShowTitleBarLocales();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkShowTitleBarLocales);
  }

  checkShowTitleBarLocales = () => {
    this.setState({ showTitleBarLocales: window.innerWidth > 992 });
  };

  handleLocaleChange = (locale: string) => {
    this.setState({ locale });
  };

  render() {
    const { account } = this.props;
    const { locale, showTitleBarLocales } = this.state;

    const locales = ['all-languages'].concat(
      account.locales.map(({ locale }) => locale)
    );
    const titleBarLocales = showTitleBarLocales
      ? locales.slice(0, TITLE_BAR_LOCALE_COUNT)
      : [];
    const dropdownLocales = showTitleBarLocales
      ? locales.slice(TITLE_BAR_LOCALE_COUNT)
      : locales;

    return (
      <div className="dashboard-page">
        <div className="inner">
          <div className="title-bar">
            <h1>Stats</h1>

            <div className="underlined">
              <div className="languages">
                <span>Your Languages:</span>
                {titleBarLocales.map(l => (
                  <label key={l}>
                    <input
                      type="radio"
                      name="language"
                      checked={l == locale}
                      onChange={() => this.handleLocaleChange(l)}
                    />
                    <Localized id={l}>
                      <span />
                    </Localized>
                  </label>
                ))}
                {dropdownLocales.length > 0 && (
                  <select
                    className={
                      dropdownLocales.includes(locale) ? 'selected' : ''
                    }
                    name="language"
                    value={locale}
                    onChange={({ target: { value } }) => {
                      if (value) {
                        this.handleLocaleChange(value);
                      }
                    }}>
                    {titleBarLocales.length > 0 && <option value="" />}
                    {dropdownLocales.map(l => (
                      <Localized key={l} id={l}>
                        <option value={l} />
                      </Localized>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="progress-boxes">
            <ProgressBox key={'s' + locale} type="speak" locale={locale} />
            <ProgressBox key={'l' + locale} type="listen" locale={locale} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect<PropsFromState>(({ user }: StateTree) => ({
  account: user.account,
}))(Dashboard);
