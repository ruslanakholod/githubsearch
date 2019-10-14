import React from 'react';
import { Query } from 'react-apollo';


const GitProfile = ({ user }) => (

  <Query query={user}>
    {({ loading, error, data }) => {
      if (loading) return <h4>Loading</h4>
      if (error) return <h4>Not found</h4>

      let repositories;
      let user;
      if (data) {
        user = data.repositoryOwner;
      } else {
        user = null;
      }

      if (user) {
        repositories = data.repositoryOwner.repositories.nodes;
      } else {
        repositories = null;
      }

      return (
        <div>
          {user != null ?
            <div>
              {user.login}
              {user.avatarUrl}
              {repositories &&
                <div>
                  <ul>
                    {repositories.map((repository, index) => {
                      return <li key={index} >{repository.name}, {repository.url}</li>
                    })}
                  </ul>
                </div>
              }
            </div>
            :
            <h4> found</h4>
          }
        </div>
      )
    }}
  </Query>
)

export default GitProfile;