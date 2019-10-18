import React from 'react';
import { Query } from 'react-apollo';
import { css } from 'emotion';


const GitHubProfile = ({ user }) => (

  <Query query={user}>
    {({ loading, error, data }) => {
      if (loading) return <p className={styles.user_error}>Loading...</p>
      if (error) return <p className={styles.user_error}>There is no such user. Try again</p>

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
            <div className={styles.profile}>
              <div>
                <div className={styles.profile__photo} style={{ backgroundImage: `url(${user.avatarUrl})` }} />
                <p className={styles.profile__login}>{user.login}</p>
              </div>
              <div className={styles.profile__repositories}>
                <p>Repositories:</p>
                {repositories.length > 0 ?
                  <ul>
                    {repositories.map((repository, index) => {
                      return <li className={styles.profile__repository} key={index} >
                        <a href={repository.url} target='_blank' rel="noopener noreferrer">{repository.name}
                        </a>
                      </li>
                    })}
                  </ul>
                  :
                  <p>No repositories</p>
                }
              </div>
            </div>
            :
            <p className={styles.user_error}>There is no such user. Try again</p>
          }
        </div>
      )
    }}
  </Query>
)

export default GitHubProfile;

const styles = {
  profile: css`
    display: flex;
    justify-content: center;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: center;
    }
  `,

  profile__login: css`
    text-align: center;
    margin-top: 20px;
    font-size: 35px;

    @media (max-width: 767px) {
      font-size: 25px;
    }
  `,

  profile__photo: css`
    margin: 0 auto;
    width: 170px;
    height: 170px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;

    @media (max-width: 767px) {
      width: 130px;
      height: 130px;
    }
  `,

  profile__repositories: css`
    margin-left: 100px;

    @media (max-width: 767px) {
        margin-top: 20px;
        margin-left: 0;
    }

    p:first-of-type {
      margin-bottom: 20px;
      font-size: 25px;

      @media (max-width: 767px) {
        font-size: 20px;
      }
    }

    p {
      font-size: 20px;

      @media (max-width: 767px) {
        text-align: center;
      }
    }

    li {
      margin-bottom: 10px;
      font-size: 20px;

      @media (max-width: 767px) {
        font-size: 18px;
      }

      a {
        text-decoration: none;
        border-bottom: 2px solid black;
        color: black;
      }
    }
  `,

  user_error: css`
    text-align: center;
    font-size: 22px;

    @media (max-width: 767px) {
      
    }
  `,
}