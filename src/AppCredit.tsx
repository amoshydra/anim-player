import { css } from '@linaria/core';

const username = "amoshydra";
const repository = "anim-player";

const creditStyle = css`
  text-align: center;
  padding: 2rem;
  padding-top: 4rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  margin: calc(-1 * var(--global-padding));
  margin-top: 4rem;
  border-top: 1px solid #dedede;

  a {
    color: blue;
    text-decoration: none;
    code {
      letter-spacing: -0.001em;
      font-family: monospace;
      font-size: 1rem;
    }
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const AppCredit = () => {
  return (
    <div className={creditStyle}>
      <p>
        Source code @&nbsp;
        <a href={`https://github.com/${username}/${repository}`} target="_blank" rel="noopener noreferrer">
          <code>{username}</code>
          <span> / </span>
          <code>{repository}</code>
        </a>
      </p>
    </div>
  );
}
