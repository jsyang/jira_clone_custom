import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useRouteMatch } from 'react-router-dom';

import { ProjectCategoryCopy } from 'shared/constants/projects';
import { Icon, ProjectAvatar } from 'shared/components';

import {
  Sidebar,
  ProjectInfo,
  ProjectTexts,
  ProjectName,
  ProjectCategory,
  Divider,
  LinkItem,
  LinkText,
} from './Styles';

const propTypes = {
  project: PropTypes.object.isRequired,
  issueSearchModalOpen: PropTypes.func.isRequired,
  issueCreateModalOpen: PropTypes.func.isRequired,
};

const ProjectSidebar = ({ project, issueSearchModalOpen, issueCreateModalOpen }) => {
  const match = useRouteMatch();

  return (
    <Sidebar>
      <ProjectInfo>
        <ProjectAvatar />
        <ProjectTexts>
          <ProjectName>{project.name}</ProjectName>
          <ProjectCategory>{ProjectCategoryCopy[project.category]} project</ProjectCategory>
        </ProjectTexts>
      </ProjectInfo>

      {renderLinkItem(match, 'Board', 'board', '/board')}
      {renderLinkItem(match, 'Search issues', 'search', null, issueSearchModalOpen)}
      {renderLinkItem(match, 'Create new issue', 'plus', null, issueCreateModalOpen)}
      <Divider />
      {renderLinkItem(match, 'Settings', 'settings', '/settings')}
    </Sidebar>
  );
};

const renderLinkItem = (match, text, iconType, path, onClick) => {
  const linkItemProps = path
    ? { as: NavLink, exact: true, to: `${match.path}${path}` }
    : { as: 'div', onClick };

  return (
    <LinkItem {...linkItemProps}>
      <Icon type={iconType} />
      <LinkText>{text}</LinkText>
    </LinkItem>
  );
};

ProjectSidebar.propTypes = propTypes;

export default ProjectSidebar;
