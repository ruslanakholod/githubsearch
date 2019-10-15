import React from 'react';
import { ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import Profile from './Components/Profile';
import { Query } from 'react-apollo';



const REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN = 'e66a0918d16e144baf9a6d7de268beef7c2f6ad9';
const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' })

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
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
      console.log(1)
      if (searchRequest.length > 1) {
        this.setState({
          result: searchRequest.replace(/\W/, '')
        });
      } else {
        console.log(2)

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
      console.log(3)

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
        <div className="App">
          <input type='text' placeholder='git' onChange={this.handleChange} />
          < Profile user={GET_CURRENT_USER} />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;