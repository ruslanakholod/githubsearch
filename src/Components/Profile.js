import React from 'react';
import { Query } from 'react-apollo';
import { css } from 'emotion';


const GitProfile = ({ user }) => (

  <Query query={user}>
    {({ loading, error, data }) => {
      if (loading) return <p className={styles.user_error}>Loading</p>
      if (error) return <p className={styles.user_error}>User not found. Try again</p>

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
            <p className={styles.user_error}>User not found. Try again</p>
          }
        </div>
      )
    }}
  </Query>
)

export default GitProfile;

const styles = {
  user_error: css`
    text-align: center;
    font-size: 22px;
  `,
}