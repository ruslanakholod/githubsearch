import React from 'react';
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import Profile from './Components/Profile';
import { injectGlobal, css } from 'emotion';
import { withRouter } from "react-router";
import queryString from 'query-string';


const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' })

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${
        process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN
        }`,
    }
  }
})

const link = authLink.concat(httpLink)

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})


class App extends React.Component {

  state = {
    result: ''
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    const login = parsed.user;

    if (this.props.location.search) {
      this.setState({
        result: login
      })
    } else {
      this.setState({
        result: ''
      })
    }
  }

  componentWillUnmount() {
    this.setState({
      result: ''
    })
  }

  handleChange = (e) => {
    let searchRequest = e.target.value.trim().toLowerCase();
    let regex = /\W/gi;
    let test = regex.test(searchRequest);

    if (e.target.value.charAt(0) === ' ') {
      e.target.value = '';
    } else if (test) (
      e.target.value = e.target.value.replace(/\W/, '')
    )

    if (test) {
      if (searchRequest.length > 1) {
        this.setState({
          result: searchRequest.replace(/\W/, '')
        }, () => {
          this.props.history.push(`/?user=${this.state.result}`)
        });
      } else {
        this.setState({
          result: searchRequest.replace(/\W/, null)
        }, () => {
          this.props.history.push(`/?user=${this.state.result}`)
        });
      }
    }
    else if (searchRequest === '') {
      this.setState({
        result: ''
      }, () => {
        this.props.history.push(`/?user=${this.state.result}`)
      });
    }
    else {
      this.setState({
        result: searchRequest
      }, () => {
        this.props.history.push(`/?user=${this.state.result}`)
      });
    }
  };

  render() {

    const GET_CURRENT_USER = gql`
      {
          repositoryOwner(login: "${this.state.result}") {
              ... on User {
                  login
                  avatarUrl
                  repositories(last: 7) {
                    nodes{
                      name
                      url
                    }
                }
            }
        }
    }
    `

    return (
      <ApolloProvider client={client}>
        <div className={styles.app}>
          <div className={styles.app__wrapper}>
            <div className={styles.app__title}>GitHubSearch</div>
            <div className={styles.app__search_wrapper}>
              <div className={styles.app__search}>
                <input className={styles.app__search_input} type='text' placeholder='GitHub username' onChange={this.handleChange} />
              </div>
              < Profile user={GET_CURRENT_USER} />
            </div>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default withRouter(App);

injectGlobal`
        
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: Helvetica, Arial, sans-serif;       
    }
`;

const styles = {
  app__wrapper: css`
    margin: 60px;

    @media (max-width: 767px) {
      margin: 60px 25px;
    }
  `,

  app__title: css`
    font-size: 45px;
    font-weight: 700;

    @media (max-width: 767px) {
      font-size: 30px;
    }
  `,

  app__search: css`
    display: flex;
    margin-bottom: 70px;
  `,

  app__search_wrapper: css`
    margin: 70px 0;
  `,

  app__search_input: css`
    max-width: 600px;
    width: 100%;
    padding: 10px 20px;
    margin: 0 auto;
    font-size: 30px;
    border: 0;
    border-bottom: 2px solid black;
    outline: none;

    @media (max-width: 767px) {
      font-size: 25px;
    }
  `
}