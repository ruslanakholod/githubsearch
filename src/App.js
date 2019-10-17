import React from 'react';
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import Profile from './Components/Profile';
import { Query } from 'react-apollo';
import { injectGlobal, css } from 'emotion';


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
        });
      } else {
        this.setState({
          result: searchRequest.replace(/\W/, null)
        });
      }
    }
    else if (searchRequest === '') {
      this.setState({
        result: ''
      });
    }
    else {
      this.setState({
        result: searchRequest
      });
    }

  };

  render() {

    const GET_CURRENT_USER = gql`
      {
          repositoryOwner(login: "${ this.state.result}") {
              ... on User {
                  login
                  avatarUrl
                  repositories(first: 7) {
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
                <input className={styles.app__search_input} type='text' placeholder='Username' onChange={this.handleChange} />
              </div>
              < Profile user={GET_CURRENT_USER} />
            </div>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;

injectGlobal`
        
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: Helvetica, Arial, sans-serif;       
    }
`;

const styles = {
  app: css`
    font-size: 30px;
  `,
  app__wrapper: css`
    margin: 60px;
  `,
  app__title: css`
    font-size: 45px;
    font-weight: 700;
  `,
  app__search: css`
    display: flex;
    margin-bottom: 40px;
  `,
  app__search_wrapper: css`
    margin: 70px 0;
  `,
  app__search_input: css`
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
    font-size: 30px;
    border: 0;
    border-bottom: 2px solid black;
    outline: none;
  `,

}