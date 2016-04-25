import React from 'react';
import ajax from 'superagent';
import { IndexLink, Link } from 'react-router';

class Detail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'commits',
      commits: [],
      forks: [],
      pulls: [],
    };
  }

  fetchFeed(type) {
    if (this.props.params.repo === '') {
      // empty repo name, bail out!
      return;
    }
    const baseUrl = 'https://api.github.com/repos/facebook';
    ajax.get(`${baseUrl}/${this.props.params.repo}/${type}`)
      .end((error, response) => {
        if (!error && response) {
          this.saveFeed(type, response.body);
        } else {
          console.log(`There was an error fetching ${type} from Github`, error);
        }
      }
    );
  }

  saveFeed(type, contents) {
    this.setState({ [type]: contents });
  }

  componentWillMount() {
    this.fetchFeed('commits');
    this.fetchFeed('forks');
    this.fetchFeed('pulls');
  }

  renderCommits() {
    return this.state.commits.map((commit, index) => {
      let author = commit.author ? commit.author.login : 'Anonymous';

      return (
        <p key={index} className="github">
        <Link to={`/user/${author}`}><strong>{author}</strong></Link>:&nbsp;
        <a href={commit.html_url}>{commit.commit.message}</a>.
        </p>
        );
    });
  }

  renderForks() {
    return this.state.forks.map((fork, index) => {
      let owner = fork.owner ? fork.owner.login : 'Anonymous';

      return (
        <p key={index} className="github">
        <Link to={`/user/${owner}`}>
        <strong>{owner}</strong>
        </Link>:&nbsp;forked to&nbsp;
        <a href={fork.html_url}>{fork.html_url}</a>. at {fork.created_at}.
        </p>
        );
    });
  }

  renderPulls() {
    return this.state.pulls.map((pull, index) => {
      let user = pull.user ? pull.user.login : 'Anonymous';

      return (
        <p key={index} className="github">
        <Link to={`/user/${user}`}><strong>{user}</strong></Link>:&nbsp;
        <a href={pull.html_url}>{pull.body}</a>.
        </p>
        );
    });
  }

  selectMode(mode) {
    this.setState({ mode });
  }

  render() {
    let content;

    if (this.state.mode === 'commits') {
      content = this.renderCommits();
    } else if (this.state.mode === 'forks') {
      content = this.renderForks();
    } else {
      content = this.renderPulls();
    }

    return (<div>
      <p>
        You are here:
        <IndexLink to="/" activeClassName="active">Home</IndexLink>
        > {this.props.params.repo}
      </p>
      <button onClick={this.selectMode.bind(this, 'commits')} ref="commits">Show Commits</button>
      <button onClick={this.selectMode.bind(this, 'forks')} ref="forks">Show Forks</button>
      <button onClick={this.selectMode.bind(this, 'pulls')} ref="pulls">Show Pulls</button>
      {content}
      </div>);
  }
}

Detail.propTypes = {
  params: React.propTypes.object,
};

export default Detail;
