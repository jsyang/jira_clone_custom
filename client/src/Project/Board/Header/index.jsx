import React from 'react';

import { Button } from 'shared/components';

import { Header, BoardName } from './Styles';

const ProjectBoardHeader = ({ projectUrl }) => (
  <Header>
    <BoardName>Board</BoardName>
    <a href={projectUrl} target="_blank" rel="noreferrer noopener">
      <Button icon="feedback">Launch Project</Button>
    </a>
  </Header>
);

export default ProjectBoardHeader;
