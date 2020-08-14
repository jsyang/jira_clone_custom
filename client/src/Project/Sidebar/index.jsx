import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, useRouteMatch } from 'react-router-dom';

import { ProjectCategoryCopy } from 'shared/constants/projects';
import { Icon, ProjectAvatar } from 'shared/components';
import { removeStoredAuthToken } from 'shared/utils/authToken';

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

import useCurrentUser from '../../shared/hooks/currentUser';

const propTypes = {
  project: PropTypes.object.isRequired,
  issueSearchModalOpen: PropTypes.func.isRequired,
  issueCreateModalOpen: PropTypes.func.isRequired,
  loginModalOpen: PropTypes.func.isRequired,
};

const ProjectSidebar = ({
  project,
  issueSearchModalOpen,
  issueCreateModalOpen,
  loginModalOpen,
}) => {
  const match = useRouteMatch();

  const { privilegeLevel } = useCurrentUser();

  const logout = () => {
    removeStoredAuthToken();
    window.location.reload();
  };

  const settingsSection = (
    <div>
      <Divider />
      {renderLinkItem(match, 'Settings', 'settings', '/settings')}
      {renderLinkItem(match, 'Logout', 'arrow-left', null, logout)}
    </div>
  );

  const loginSection = (
    <div>
      <Divider />
      {renderLinkItem(match, 'Login', 'arrow-right', null, loginModalOpen)}
    </div>
  );

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
      {privilegeLevel !== 0 ? settingsSection : loginSection}
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
