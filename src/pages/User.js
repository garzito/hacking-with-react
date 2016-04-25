import React from 'react';
import Ajax from 'superagent';
import { IndexLink } from 'react-router';

class User extends React.Component {
  constructor() {
    super();

    this.state = {
      events: [],
    };
  }

  componentWillMount() {
    Ajax.get(`https://api.github.com/users/${this.props.params.user}/events`)
    .end((error, response) => {
      if (!error && response) {
        this.setState({ events: response.body });
        console.dir(response.body);
      } else {
        console.log('There was an error fetching user from Github', error);
      }
    }
    );
  }

  render() {
    return (
      <div>
        <p>
          You are here:
          <IndexLink to="/" activeNameClass="active">Home</IndexLink>
          > User: {this.props.params.user}
        </p>
        {this.state.events.map((event, index) =>
          <p key={index}>
            Type: <strong>{event.type}</strong><br />
            On: {event.repo.name}<br />
            When: {event.created_at}
          </p>
        )}
      </div>
    );
  }
}

User.propTypes = {
  params: React.propTypes.object,
};

export default User;
